"use strict";
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
/**
 * schedule a retry of certificate request
 */
exports.scheduleRetry = (domainArg, certClassArg) => {
    let done = plugins.q.defer();
    setTimeout(() => {
        certClassArg.getDomainCert(domainArg)
            .then(done.resolve);
    }, 60000);
    return done.promise;
};
/**
 * check if a given domainCert is still valid
 */
exports.checkDomainsStillValid = (domainNameArg, sslDirArg) => {
    let domainConfigPath = plugins.path.join(sslDirArg, domainNameArg, "config.json");
    if (plugins.smartfile.fs.fileExistsSync(domainConfigPath)) {
        let domainConfig = plugins.smartfile.fs.toObjectSync(domainConfigPath, "json");
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
;
/**
 * update a ssl directory
 */
exports.updateSslDirSync = (sslDirArg, domainNameArg) => {
    plugins.smartfile.fs.ensureDirSync(sslDirArg);
    let domainCertFolder = plugins.path.join(paths.certDir, domainNameArg);
    if (plugins.smartfile.fs.listFoldersSync(paths.certDir).indexOf(domainNameArg) != -1) {
        plugins.smartfile.fs.copySync(plugins.path.join(domainCertFolder, "fullchain.pem"), plugins.path.join(sslDirArg, domainNameArg, "fullchain.pem"));
        plugins.smartfile.fs.copySync(plugins.path.join(domainCertFolder, "privkey.pem"), plugins.path.join(sslDirArg, domainNameArg, "privkey.pem"));
        // create cert config
        let certRegex = /.*\-([0-9]*)\.pem/;
        let certFileNameWithTime = plugins.smartfile.fs.listFilesSync(domainCertFolder, certRegex)[0];
        let certTime = parseInt(certRegex.exec(certFileNameWithTime)[1]);
        let certConfig = {
            domainName: domainNameArg,
            created: certTime,
            expires: certTime + 7776000
        };
        plugins.smartfile.memory.toFsSync(JSON.stringify(certConfig), plugins.path.join(sslDirArg, domainNameArg, "config.json"));
    }
    ;
};
let updateGitOrigin = (syncDirectionArg) => {
};
updateGitOrigin(0 /* toOrigin */);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnQuaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2NlcnQuY2xhc3Nlcy5jZXJ0LmhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE1BQVksT0FBTyxXQUFNLGdCQUFnQixDQUFDLENBQUE7QUFDMUMsTUFBWSxLQUFLLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFJdEM7O0dBRUc7QUFDUSxxQkFBYSxHQUFHLENBQUMsU0FBZ0IsRUFBQyxZQUFpQjtJQUMxRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzdCLFVBQVUsQ0FBQztRQUNQLFlBQVksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO2FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDUSw4QkFBc0IsR0FBRyxDQUFDLGFBQXFCLEVBQUUsU0FBaUI7SUFDekUsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2xGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQ2hELGdCQUFnQixFQUNoQixNQUFNLENBQ1QsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxJ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