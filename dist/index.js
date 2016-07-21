"use strict";
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
;
class Cert {
    /**
     * Constructor for Cert object
     */
    constructor(optionsArg) {
        this.domainsCurrentlyRequesting = [];
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
        plugins.shelljs.exec(`bash -c "${paths.letsencryptSh}`);
    }
    ;
    /**
     * gets a ssl cert for a given domain
     */
    getDomainCert(domainNameArg, optionsArg = { force: false }) {
        let done = plugins.q.defer();
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
                done.resolve();
            });
        }
        else {
            plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
            done.resolve();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxPQUFPLFdBQU0sZ0JBQWdCLENBQUMsQ0FBQTtBQUMxQyxNQUFZLEtBQUssV0FBTSxjQUFjLENBQUMsQ0FBQTtBQVFyQyxDQUFDO0FBRUY7SUFVSTs7T0FFRztJQUNILFlBQVksVUFBa0M7UUFQOUMsK0JBQTBCLEdBQWEsRUFBRSxDQUFDO1FBOEMxQzs7V0FFRztRQUNILHFCQUFnQixHQUFHO1lBQ2YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVELENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRjs7V0FFRztRQUNILDhCQUF5QixHQUFHO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLHVEQUF1RCxDQUFDLENBQUM7Z0JBQy9GLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVELENBQUM7UUFDTCxDQUFDLENBQUM7UUF4REUsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUNyQyxvQkFBb0I7UUFDcEIsSUFBSSxNQUFNLEdBQUc7WUFDVCxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3JCLENBQUE7UUFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUNyRCxDQUFDO1FBQ0YsZUFBZTtRQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUN0RCxZQUFZO1FBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDNUIsQ0FBQztRQUNELHFCQUFxQjtRQUNyQixJQUFJLGdCQUFnQixDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLGdCQUFnQixHQUFHLDJEQUEyRCxDQUFDO1FBQ25GLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztRQUMzQixDQUFDO1FBQUEsQ0FBQztRQUNGLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FDN0IsZ0JBQWdCLEVBQ2hCLEtBQUssQ0FBQyxVQUFVLENBQ25CLENBQUM7UUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDOztJQXNCRDs7T0FFRztJQUNILGFBQWEsQ0FBQyxhQUFxQixFQUFFLFVBQVUsR0FBdUIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQ2xGLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDNUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2hCLFlBQVksS0FBSyxDQUFDLGFBQWEsb0JBQW9CLEtBQUssQ0FBQyxVQUFVLE9BQU8sYUFBYSxpQkFBaUIsS0FBSyxDQUFDLFFBQVEsT0FBTyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQzdJO2dCQUNJLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEtBQUssRUFBQyxJQUFJO2FBQ2IsRUFDRCxDQUFDLE9BQU8sRUFBRSxTQUFTO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksaUJBQWlCLEdBQWEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdEYsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFDOUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDcEYsQ0FBQztnQkFDRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxhQUFhLEdBQUcsd0NBQXdDLENBQUMsQ0FBQztZQUN0RyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUFBLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDOztJQUNELG9CQUFvQjtJQUVwQixDQUFDOztBQUNMLENBQUM7QUF6R1ksWUFBSSxPQXlHaEIsQ0FBQTtBQUVEO0lBSUk7SUFFQSxDQUFDOztBQUNMLENBQUM7QUFQWSxtQkFBVyxjQU92QixDQUFBO0FBUUQsSUFBSSxzQkFBc0IsR0FBRyxDQUFDLGFBQXFCLEVBQUUsU0FBaUI7SUFDbEUsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUN2RCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQ2hELGdCQUFnQixFQUNoQixNQUFNLENBQ1QsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7QUFFTCxDQUFDLENBQUE7QUFFRCxJQUFJLGdCQUFnQixHQUFHLENBQUMsU0FBaUIsRUFBRSxhQUFxQjtJQUM1RCxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQ3RFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxFQUNwRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUMvRCxDQUFDO1FBQ0YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsRUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FDN0QsQ0FBQztRQUNGLHFCQUFxQjtRQUNyQixJQUFJLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztRQUNwQyxJQUFJLG9CQUFvQixHQUFXLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxVQUFVLEdBQWU7WUFDekIsVUFBVSxFQUFFLGFBQWE7WUFDekIsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLFFBQVEsR0FBRyxPQUFPO1NBQzlCLENBQUM7UUFDRixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQzdELENBQUM7SUFDTixDQUFDO0lBQUEsQ0FBQztBQUNOLENBQUMsQ0FBQTtBQU9ELElBQUksZUFBZSxHQUFHLENBQUMsZ0JBQWtDO0FBRXpELENBQUMsQ0FBQztBQUVGLGVBQWUsQ0FBQyxnQkFBeUIsQ0FBQyxDQUFDIn0=