"use strict";
var plugins = require("./cert.plugins");
var paths = require("./cert.paths");
var Cert = (function () {
    function Cert(optionsArg) {
        this._cfEmail = optionsArg.cfEmail;
        this._cfKey = optionsArg.cfKey;
        this._sslDir = optionsArg.sslDir;
        this.gitOriginRepo = optionsArg.gitOriginRepo;
        var config = {
            cfEmail: this._cfEmail,
            cfKey: this._cfKey
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(config), plugins.path.join(__dirname, "assets/config.json"));
    }
    ;
    Cert.prototype.getDomainCert = function (domainNameArg, optionsArg) {
        var done = plugins.q.defer();
        if (!checkDomainsStillValid(domainNameArg) || optionsArg.force) {
            plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
            plugins.shelljs.exec("chmod 700 " + paths.certHook);
            plugins.shelljs.exec("bash -c \"" + paths.letsencryptSh + " -c -d " + domainNameArg + " -t dns-01 -k " + paths.certHook + " -o " + paths.certDir + "\"");
            var fetchedCertsArray = plugins.smartfile.fs.listFoldersSync(paths.certDir);
            if (fetchedCertsArray.indexOf(domainNameArg) != -1) {
                updateSslDirSync(this._sslDir, domainNameArg);
            }
            done.resolve();
        }
        else {
            plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
            done.resolve();
        }
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
var updateGitOrigin = function () {
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxPQUFPLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxJQUFZLEtBQUssV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUV0QztJQU9JLGNBQVksVUFLWDtRQUNHLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUM5QyxJQUFJLE1BQU0sR0FBRztZQUNULE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDckIsQ0FBQTtRQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7SUFDakgsQ0FBQzs7SUFDRCw0QkFBYSxHQUFiLFVBQWMsYUFBcUIsRUFBQyxVQUEyQjtRQUMzRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN6RCxPQUFPLENBQUMsT0FBTyxDQUFDLElB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