"use strict";
var plugins = require("./cert.plugins");
var paths = require("./cert.paths");
;
var Cert = (function () {
    function Cert(optionsArg) {
        var _this = this;
        this.sslGitOriginPull = function () {
            if (_this._gitOriginRepo) {
                plugins.smartgit.pull(_this._sslDir, "origin", "master");
            }
        };
        this.sslGitOriginAddCommitPush = function () {
            if (_this._gitOriginRepo) {
                plugins.smartgit.add.addAll(_this._sslDir);
                plugins.smartgit.commit(_this._sslDir, "added new SSL certificates and deleted obsolete ones.");
                plugins.smartgit.push(_this._sslDir, "origin", "master");
            }
        };
        this._cfEmail = optionsArg.cfEmail;
        this._cfKey = optionsArg.cfKey;
        this._sslDir = optionsArg.sslDir;
        this._gitOriginRepo = optionsArg.gitOriginRepo;
        this._testMode = optionsArg.testMode;
        // write hook config
        var config = {
            cfEmail: this._cfEmail,
            cfKey: this._cfKey
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(config), plugins.path.join(__dirname, "assets/config.json"));
        // setup sslDir
        if (!this._sslDir)
            this._sslDir = paths.defaultSslDir;
        // setup Git
        if (this._gitOriginRepo) {
            plugins.smartgit.init(this._sslDir);
            plugins.smartgit.remote.add(this._sslDir, "origin", this._gitOriginRepo);
            this.sslGitOriginPull();
        }
        // setup leSh config;
        var leShConfigString;
        if (this._testMode) {
            leShConfigString = "CA=\"https://acme-staging.api.letsencrypt.org/directory\"\n";
        }
        else {
            leShConfigString = " ";
        }
        ;
        plugins.smartfile.memory.toFsSync(leShConfigString, paths.leShConfig);
    }
    ;
    Cert.prototype.getDomainCert = function (domainNameArg, optionsArg) {
        if (optionsArg === void 0) { optionsArg = { force: false }; }
        var done = plugins.q.defer();
        this.sslGitOriginPull();
        if (!checkDomainsStillValid(domainNameArg, this._sslDir) || optionsArg.force) {
            plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
            plugins.shelljs.exec("chmod 700 " + paths.certHook);
            plugins.smartfile.fs.ensureDir(paths.certDir);
            plugins.shelljs.exec("bash -c \"" + paths.letsencryptSh + " -c -f " + paths.leShConfig + " -d " + domainNameArg + " -t dns-01 -k " + paths.certHook + " -o " + paths.certDir + "\"");
            var fetchedCertsArray = plugins.smartfile.fs.listFoldersSync(paths.certDir);
            if (fetchedCertsArray.indexOf(domainNameArg) != -1) {
                updateSslDirSync(this._sslDir, domainNameArg);
                plugins.smartfile.fs.removeSync(plugins.path.join(paths.certDir, domainNameArg));
            }
            this.sslGitOriginAddCommitPush();
            done.resolve();
        }
        else {
            plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
            done.resolve();
        }
        ;
        return done.promise;
    };
    ;
    Cert.prototype.cleanOldCertificates = function () {
    };
    ;
    return Cert;
}());
exports.Cert = Cert;
var Certificate = (function () {
    function Certificate() {
    }
    ;
    return Certificate;
}());
exports.Certificate = Certificate;
var checkDomainsStillValid = function (domainNameArg, sslDirArg) {
    var domainConfigPath = plugins.path.join(sslDirArg, domainNameArg, "config.json");
    if (plugins.smartfile.fs.fileExistsSync(domainConfigPath)) {
        var domainConfig = plugins.smartfile.fs.toObjectSync(domainConfigPath, "json");
        if (Date.now() >= ((domainConfig.expires - 604800) * 1000)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
};
var updateSslDirSync = function (sslDirArg, domainNameArg) {
    plugins.smartfile.fs.ensureDirSync(sslDirArg);
    var domainCertFolder = plugins.path.join(paths.certDir, domainNameArg);
    if (plugins.smartfile.fs.listFoldersSync(paths.certDir).indexOf(domainNameArg) != -1) {
        plugins.smartfile.fs.copySync(plugins.path.join(domainCertFolder, "fullchain.pem"), plugins.path.join(sslDirArg, domainNameArg, "fullchain.pem"));
        plugins.smartfile.fs.copySync(plugins.path.join(domainCertFolder, "privkey.pem"), plugins.path.join(sslDirArg, domainNameArg, "privkey.pem"));
        // create cert config
        var certRegex = /.*\-([0-9]*)\.pem/;
        var certFileNameWithTime = plugins.smartfile.fs.listFilesSync(domainCertFolder, certRegex)[0];
        var certTime = parseInt(certRegex.exec(certFileNameWithTime)[1]);
        var certConfig = {
            domainName: domainNameArg,
            created: certTime,
            expires: certTime + 7776000
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(certConfig), plugins.path.join(sslDirArg, domainNameArg, "config.json"));
    }
    ;
};
var updateGitOrigin = function (syncDirectionArg) {
};
updateGitOrigin(0 /* toOrigin */);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxPQUFPLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxJQUFZLEtBQUssV0FBTSxjQUFjLENBQUMsQ0FBQTtBQVFyQyxDQUFDO0FBRUY7SUFRSSxjQUFZLFVBQWtDO1FBUmxELGlCQWlGQztRQXRDRyxxQkFBZ0IsR0FBRztZQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsOEJBQXlCLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUUsdURBQXVELENBQUMsQ0FBQztnQkFDL0YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNMLENBQUMsQ0FBQztRQTdDRSxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7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