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
                            }
                            ;
                            done.resolve();
                        }
                        else {
                            plugins.beautylog.warn(`${domainNameArg} scheduled for retry`);
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