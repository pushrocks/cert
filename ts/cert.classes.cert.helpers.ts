import {Cert} from "./index.ts";
import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";



/**
 * schedule a retry of certificate request
 */
export let scheduleRetry = (domainArg:string,certClassArg:Cert) => {
    let done = plugins.q.defer();
    setTimeout(() => {
        certClassArg.getDomainCert(domainArg)
            .then(done.resolve);
    },20000);
    return done.promise;
};

/**
 * check if a given domainCert is still valid
 */
export let checkDomainsStillValid = (domainNameArg: string, sslDirArg: string): boolean => {
    let domainConfigPath = plugins.path.join(sslDirArg, domainNameArg, "config.json");
    if (plugins.smartfile.fs.fileExistsSync(domainConfigPath)) {
        let domainConfig = plugins.smartfile.fs.toObjectSync(
            domainConfigPath,
            "json"
        );
        if (Date.now() >= ((domainConfig.expires - 604800) * 1000)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }

}

export interface certConfig {
    domainName: string;
    created: number;
    expires: number;
};

/**
 * update a ssl directory
 */
export let updateSslDirSync = (sslDirArg: string, domainNameArg: string) => {
    plugins.smartfile.fs.ensureDirSync(sslDirArg);
    let domainCertFolder = plugins.path.join(paths.certDir, domainNameArg)
    if (plugins.smartfile.fs.listFoldersSync(paths.certDir).indexOf(domainNameArg) != -1) {
        plugins.smartfile.fs.copySync(
            plugins.path.join(domainCertFolder, "fullchain.pem"),
            plugins.path.join(sslDirArg, domainNameArg, "fullchain.pem")
        );
        plugins.smartfile.fs.copySync(
            plugins.path.join(domainCertFolder, "privkey.pem"),
            plugins.path.join(sslDirArg, domainNameArg, "privkey.pem")
        );
        // create cert config
        let certRegex = /.*\-([0-9]*)\.pem/;
        let certFileNameWithTime: string = plugins.smartfile.fs.listFilesSync(domainCertFolder, certRegex)[0];
        let certTime = parseInt(certRegex.exec(certFileNameWithTime)[1]);
        let certConfig: certConfig = {
            domainName: domainNameArg,
            created: certTime,
            expires: certTime + 7776000
        };
        plugins.smartfile.memory.toFsSync(
            JSON.stringify(certConfig),
            plugins.path.join(sslDirArg, domainNameArg, "config.json")
        );
    };
}

const enum gitSyncDirection {
    toOrigin,
    fromOrigin
}

let updateGitOrigin = (syncDirectionArg: gitSyncDirection) => {

};

updateGitOrigin(gitSyncDirection.toOrigin);