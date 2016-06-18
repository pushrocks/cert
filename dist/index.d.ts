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
        gitOriginRepo: string;
    });
    getDomainCert(): void;
}
export declare class Certificate {
    constructor();
}
