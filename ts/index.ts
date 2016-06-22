import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

export class Cert {
    cfEmail:string;
    cfKey:string;
    sslDir:string;
    certificatesPresent;
    certificatesValid;
    gitOriginRepo;
    constructor(optionsArg:{
        cfEmail:string,
        cfKey:string,
        sslDir:string,
        gitOriginRepo?:string
    }){
        this.cfEmail = optionsArg.cfEmail;
        this.cfKey = optionsArg.cfKey;
        this.sslDir = optionsArg.sslDir;
        this.gitOriginRepo = optionsArg.gitOriginRepo;
        let config = {
            cfEmail: this.cfEmail,
            cfKey: this.cfKey
        }
        plugins.smartfile.memory.toFsSync(JSON.stringify(config),{fileName:"config.json",filePath:plugins.path.join(__dirname,"assets/")});
    };
    getDomainCert(domainNameArg:string){
        let done = plugins.q.defer();
        plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
        plugins.shelljs.exec("chmod 700 " + paths.certHook);
        plugins.shelljs.exec("bash -c \"" + paths.letsencryptSh + " -c -d " + domainNameArg + " -t dns-01 -k " + paths.certHook + " -o "+ paths.sslDir + "\"");
        done.resolve();
        return done.promise;
    };
}

class Certificate {
    domainName:string;
    creationDate:Date;
    expiryDate:Date;
    constructor(){

    };
}

let updateSslDir = () => {

}

let updateGitOrigin = () => {
    
}