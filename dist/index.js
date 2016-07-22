"use strict";
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
const helpers = require("./cert.helpers");
;
class Cert {
    /**
     * Constructor for Cert object
     */
    constructor(optionsArg) {
        this.domainsCurrentlyRequesting = new plugins.lik.Stringmap();
        /**
         * Pulls already requested certificates from git origin
         */
        this.sslGitOriginPull = () => {
            if (this._gitOriginRepo) {
                plugins.smartgit.pull(this._sslDir, "origin", "master");
            }
        };
        /**
         * Pushes all new requested certificates to git origin
         */
        this.sslGitOriginAddCommitPush = () => {
            if (this._gitOriginRepo) {
                plugins.smartgit.add.addAll(this._sslDir);
                plugins.smartgit.commit(this._sslDir, "added new SSL certificates and deleted obsolete ones.");
                plugins.smartgit.push(this._sslDir, "origin", "master");
            }
        };
        this._cfEmail = optionsArg.cfEmail;
        this._cfKey = optionsArg.cfKey;
        this._sslDir = optionsArg.sslDir;
        this._gitOriginRepo = optionsArg.gitOriginRepo;
        this._testMode = optionsArg.testMode;
        // write hook config
        let config = {
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
        let leShConfigString;
        if (this._testMode) {
            leShConfigString = `CA="https://acme-staging.api.letsencrypt.org/directory"\n`;
        }
        else {
            leShConfigString = " ";
        }
        ;
        plugins.smartfile.memory.toFsSync(leShConfigString, paths.leShConfig);
        plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
        plugins.shelljs.exec("chmod 700 " + paths.certHook);
    }
    ;
    /**
     * gets a ssl cert for a given domain
     */
    getDomainCert(domainNameArg, optionsArg = { force: false }) {
        let done = plugins.q.defer();
        // make sure no one else requires the same domain at the same time
        helpers.accountsKeyPresent().then(() => {
            if (!this.domainsCurrentlyRequesting.checkString(domainNameArg)) {
                this.domainsCurrentlyRequesting.addString(domainNameArg);
                if (!checkDomainsStillValid(domainNameArg, this._sslDir) || optionsArg.force) {
                    plugins.smartfile.fs.ensureDir(paths.certDir);
                    plugins.beautylog.info(`getting cert for ${domainNameArg}`);
                    plugins.shelljs.exec(`bash -c "${paths.letsencryptSh} -c --no-lock -f ${paths.leShConfig} -d ${domainNameArg} -t dns-01 -k ${paths.certHook} -o ${paths.certDir}"`, {
                        silent: true,
                        async: true
                    }, (codeArg, stdoutArg) => {
                        console.log(stdoutArg);
                        let fetchedCertsArray = plugins.smartfile.fs.listFoldersSync(paths.certDir);
                        if (fetchedCertsArray.indexOf(domainNameArg) != -1) {
                            updateSslDirSync(this._sslDir, domainNameArg);
                            plugins.smartfile.fs.removeSync(plugins.path.join(paths.certDir, domainNameArg));
                        }
                        this.domainsCurrentlyRequesting.removeString(domainNameArg);
                        done.resolve();
                    });
                }
                else {
                    plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
                    this.domainsCurrentlyRequesting.removeString(domainNameArg);
                    done.resolve();
                }
                ;
            }
            else {
                plugins.beautylog.warn(`${domainNameArg} is already requesting`);
            }
            ;
        });
        return done.promise;
    }
    ;
    cleanOldCertificates() {
    }
    ;
}
exports.Cert = Cert;
class Certificate {
    constructor() {
    }
    ;
}
exports.Certificate = Certificate;
let checkDomainsStillValid = (domainNameArg, sslDirArg) => {
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
let updateSslDirSync = (sslDirArg, domainNameArg) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxPQUFPLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxNQUFZLEtBQUssV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUN0QyxNQUFZLE9BQU8sV0FBTSxnQkFFekIsQ0FBQyxDQUZ3QztBQVF4QyxDQUFDO0FBRUY7SUFVSTs7T0FFRztJQUNILFlBQVksVUFBbUM7UUFQL0MsK0JBQTBCLEdBQTBCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQTZDaEY7O1dBRUc7UUFDSCxxQkFBZ0IsR0FBRztZQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUY7O1dBRUc7UUFDSCw4QkFBeUIsR0FBRztZQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSx1REFBdUQsQ0FBQyxDQUFDO2dCQUMvRixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBdkRFLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFB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