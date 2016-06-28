export declare class Cert {
    cfEmail: string;
    cfKey: string;
    sslDir: string;
    certificatesPresent: Certificate[];
    certificatesValid: Certificate[];
    gitOriginRepo: any;
    constructor(optionsArg: {
        cfEmail: string;
        cfKey: string;
        sslDir: string;
        gitOriginRepo?: string;
    });
    getDomainCert(domainNameArg: string, optionsArg?: {
        force: boolean;
    }): any;
}
export declare class Certificate {
    domainName: string;
    creationDate: Date;
    expiryDate: Date;
    constructor();
}
