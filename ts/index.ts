import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

export class Cert {
    cfEmail: string;
    cfKey: string;
    sslDir: string;
    certificatesPresent:Certificate[];
    certificatesValid:Certificate[];
    gitOriginRepo;
    constructor(optionsArg: {
        cfEmail: string,
        cfKey: string,
        sslDir: string,
        gitOriginRepo?: string
    }) {
        this.cfEmail = optionsArg.cfEmail;
        this.cfKey = optionsArg.cfKey;
        this.sslDir = optionsArg.sslDir;
        this.gitOriginRepo = optionsArg.gitOriginRepo;
        let config = {
            cfEmail: this.cfEmail,
            cfKey: this.cfKey
        }
        plugins.smartfile.memory.toFsSync(JSON.stringify(config),plugins.path.join(__dirname, "assets/config.json"));
    };
    getDomainCert(domainNameArg: string,optionsArg?:{force:boolean}) {
        let done = plugins.q.defer();
        if (!checkDomainStillValid(domainNameArg) || optionsArg.force) {
            plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
            plugins.shelljs.exec("chmod 700 " + paths.certHook);
            plugins.shelljs.exec("bash -c \"" + paths.letsencryptSh + " -c -d " + domainNameArg + " -t dns-01 -k " + paths.certHook + " -o " + paths.certDir + "\"");
            let fetchedCertsArray:string[] = plugins.smartfile.fs.listFoldersSync(paths.certDir);
            if(fetchedCertsArray.indexOf(domainNameArg) != -1){
                updateSslDir(domainNameArg);
            }
            done.resolve();
        } else {
            plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
            done.resolve();
        }
        return done.promise;
    };
}

export class Certificate {
    domainName: string;
    creationDate: Date;
    expiryDate: Date;
    constructor() {

    };
}

let checkDomainStillValid = (domainNameArg: string): boolean => {
    return false;
}

let updateSslDir = (domainNameArg) => {
    
}

let updateGitOrigin = () => {

}