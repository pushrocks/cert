"use strict";
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
const helpers = require("./cert.classes.cert.helpers");
;
class Cert {
    /**
     * Constructor for Cert object
     */
    constructor(optionsArg) {
        this.domainCertRequestMap = new plugins.lik.Stringmap();
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
        plugins.shelljs.exec(`bash -c "${paths.letsencryptSh} -c --no-lock -f ${paths.leShConfig} -d notthere.notthere -t dns-01 -k ${paths.certHook} -o ${paths.certDir}"`, {
            silent: true
        });
    }
    ;
    /**
     * gets a ssl cert for a given domain
     */
    getDomainCert(domainNameArg, optionsArg = { force: false }) {
        let done = plugins.q.defer();
        let domainStringData = new plugins.smartstring.Domain(domainNameArg);
        let sameZoneRequesting = this.domainCertRequestMap.checkMinimatch("*" + domainStringData.zoneName);
        // make sure no one else requires the same domain at the same time
        if (!this.domainCertRequestMap.checkString(domainNameArg)) {
            this.domainCertRequestMap.addString(domainNameArg);
            if (!helpers.checkDomainsStillValid(domainNameArg, this._sslDir) || optionsArg.force) {
                if (!sameZoneRequesting) {
                    this.sslGitOriginPull();
                    plugins.smartfile.fs.ensureDir(paths.certDir);
                    plugins.beautylog.info(`getting cert for ${domainNameArg}`);
                    plugins.shelljs.exec(`bash -c "${paths.letsencryptSh} -c --no-lock -f ${paths.leShConfig} -d ${domainNameArg} -t dns-01 -k ${paths.certHook} -o ${paths.certDir}"`, {
                        silent: true
                    }, (codeArg, stdoutArg) => {
                        if (codeArg == 0) {
                            console.log(stdoutArg);
                            let fetchedCertsArray = plugins.smartfile.fs.listFoldersSync(paths.certDir);
                            if (fetchedCertsArray.indexOf(domainNameArg) != -1) {
                                helpers.updateSslDirSync(this._sslDir, domainNameArg);
                                plugins.smartfile.fs.removeSync(plugins.path.join(paths.certDir, domainNameArg));
                                this.sslGitOriginAddCommitPush();
                            }
                            else {
                                plugins.beautylog.error(`Couldn't copy final certificate for ${domainNameArg}!`);
                            }
                            ;
                            done.resolve();
                        }
                        else {
                            plugins.beautylog.warn(`${domainNameArg} scheduled for retry. Waiting 1 minute!`);
                            helpers.scheduleRetry(domainNameArg, this).then(done.resolve);
                        }
                        this.domainCertRequestMap.removeString(domainNameArg);
                    });
                }
                else {
                    plugins.beautylog.info(`${domainNameArg} is waiting for domains names of same zone to finish`);
                    this.domainCertRequestMap.removeString(domainNameArg);
                    this.domainCertRequestMap.registerUntilTrue(() => {
                        return !this.domainCertRequestMap.checkMinimatch("*" + domainStringData.zoneName);
                    }, () => {
                        this.getDomainCert(domainNameArg).then(done.resolve);
                    });
                }
            }
            else {
                plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
                this.domainCertRequestMap.removeString(domainNameArg);
                done.resolve();
            }
            ;
        }
        else {
            plugins.beautylog.warn(`${domainNameArg} is already requesting`);
        }
        ;
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
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9jZXJ0LmNsYXNzZXMuY2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxPQUFPLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxNQUFZLEtBQUssV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUN0QyxNQUFZLE9BQU8sV0FBTSw2QkFFekIsQ0FBQyxDQUZxRDtBQVFyRCxDQUFDO0FBRUY7SUFVSTs7T0FFRztJQUNILFlBQVksVUFBbUM7UUFQL0MseUJBQW9CLEdBQTBCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQWtEMUU7O1dBRUc7UUFDSCxxQkFBZ0IsR0FBRztZQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUY7O1dBRUc7UUFDSCw4QkFBeUIsR0FBRztZQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSx1REFBdUQsQ0FBQyxDQUFDO2dCQUMvRixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBNURFLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8s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