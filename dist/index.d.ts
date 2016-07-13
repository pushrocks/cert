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
    certificatesPresent: Certificate[];
    certificatesValid: Certificate[];
    constructor(optionsArg: ICertConstructorOptions);
    sslGitOriginPull: () => void;
    sslGitOriginAddCommitPush: () => void;
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
