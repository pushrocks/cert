"use strict";
var plugins = require("./cert.plugins");
var paths = require("./cert.paths");
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
        var config = {
            cfEmail: this._cfEmail,
            cfKey: this._cfKey
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(config), plugins.path.join(__dirname, "assets/config.json"));
        if (this._gitOriginRepo) {
            plugins.smartgit.init(this._sslDir);
            plugins.smartgit.remote.add(this._sslDir, "origin", this._gitOriginRepo);
            this.sslGitOriginPull();
        }
    }
    ;
    Cert.prototype.getDomainCert = function (domainNameArg, optionsArg) {
        var done = plugins.q.defer();
        this.sslGitOriginPull();
        if (!checkDomainsStillValid(domainNameArg) || optionsArg.force) {
            plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
            plugins.shelljs.exec("chmod 700 " + paths.certHook);
            plugins.shelljs.exec("bash -c \"" + paths.letsencryptSh + " -c -d " + domainNameArg + " -t dns-01 -k " + paths.certHook + " -o " + paths.certDir + "\"");
            var fetchedCertsArray = plugins.smartfile.fs.listFoldersSync(paths.certDir);
            if (fetchedCertsArray.indexOf(domainNameArg) != -1) {
                updateSslDirSync(this._sslDir, domainNameArg);
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
var checkDomainsStillValid = function (domainNameArg) {
    return false;
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
        plugins.smartfile.memory.toFs(JSON.stringify(certConfig), plugins.path.join(sslDirArg, domainNameArg, "config.json"));
    }
    ;
};
var updateGitOrigin = function (syncDirectionArg) {
};
updateGitOrigin(0 /* toOrigin */);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxPQUFPLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxJQUFZLEtBQUssV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUV0QztJQU9JLGNBQVksVUFLWDtRQVpMLGlCQTJEQztRQS9CRyxxQkFBZ0IsR0FBRztZQUNmLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQSxDQUFDO2dCQUNwQixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxRQUFRLENBQUMsQ0FBQztZQUMxRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsOEJBQXlCLEdBQUc7WUFDeEIsRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUMsdURBQXVELENBQUMsQ0FBQztnQkFDOUYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUQsQ0FBQztRQUNMLENBQUMsQ0FBQztRQTFCRSxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDL0MsSUFBSSxN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