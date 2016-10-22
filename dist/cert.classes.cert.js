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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9jZXJ0LmNsYXNzZXMuY2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTBDO0FBQzFDLHNDQUFzQztBQUN0Qyx1REFBc0Q7QUFRckQsQ0FBQztBQUVGO0lBVUk7O09BRUc7SUFDSCxZQUFZLFVBQW1DO1FBUC9DLHlCQUFvQixHQUEwQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFrRDFFOztXQUVHO1FBQ0gscUJBQWdCLEdBQUc7WUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGOztXQUVHO1FBQ0gsOEJBQXlCLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsdURBQXVELENBQUMsQ0FBQztnQkFDL0YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNMLENBQUMsQ0FBQztRQTVERSxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdB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