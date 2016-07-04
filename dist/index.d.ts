/// <reference types="q" />
import * as plugins from "./cert.plugins";
export declare class Cert {
    private _cfEmail;
    private _cfKey;
    private _sslDir;
    certificatesPresent: Certificate[];
    certificatesValid: Certificate[];
    private _gitOriginRepo;
    constructor(optionsArg: {
        cfEmail: string;
        cfKey: string;
        sslDir: string;
        gitOriginRepo?: string;
    });
    sslGitOriginPull: () => void;
    sslGitOriginAddCommitPush: () => void;
    getDomainCert(domainNameArg: string, optionsArg?: {
        force: boolean;
    }): plugins.q.Promise<{}>;
}
export declare class Certificate {
    domainName: string;
    creationDate: Date;
    expiryDate: Date;
    constructor();
}
