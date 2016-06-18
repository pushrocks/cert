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
        gitOriginRepo:string
    }){
        this.cfEmail = optionsArg.cfEmail;
        this.cfKey = optionsArg.cfKey;
        this.sslDir = optionsArg.sslDir;
        this.gitOriginRepo = optionsArg.gitOriginRepo;
    };
    getDomainCert(){};
}

export class Certificate {
    constructor(){

    };
}