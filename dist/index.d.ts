export declare class Cert {
    cfEmail: string;
    cfKey: string;
    sslDir: string;
    certificatesPresent: any;
    certificatesValid: any;
    gitOriginRepo: any;
    constructor(optionsArg: {
        cfEmail: string;
        cfKey: string;
        sslDir: string;
        gitOriginRepo?: string;
    });
    getDomainCert(domainNameArg: string): any;
}
export declare class Certificate {
    domainName: string;
    creationDate: Date;
    expiryDate: Date;
    constructor();
}
