/// <reference types="q" />
import * as plugins from "./cert.plugins";
export interface ICertConstructorOptions {
    cfEmail: string;
    cfKey: string;
    sslDir?: string;
    gitOriginRepo?: string;
    testMode?: boolean;
}
export declare class Cert {
    private _cfEmail;
    private _cfKey;
    private _sslDir;
    private _gitOriginRepo;
    private _testMode;
    domainCertRequestMap: plugins.lik.Stringmap;
    certificatesPresent: Certificate[];
    certificatesValid: Certificate[];
    /**
     * Constructor for Cert object
     */
    constructor(optionsArg: ICertConstructorOptions);
    /**
     * Pulls already requested certificates from git origin
     */
    sslGitOriginPull: () => void;
    /**
     * Pushes all new requested certificates to git origin
     */
    sslGitOriginAddCommitPush: () => void;
    /**
     * gets a ssl cert for a given domain
     */
    getDomainCert(domainNameArg: string, optionsArg?: {
        force: boolean;
    }): plugins.q.Promise<{}>;
    cleanOldCertificates(): void;
}
export declare class Certificate {
    domainName: string;
    creationDate: Date;
    expiryDate: Date;
    constructor();
}
