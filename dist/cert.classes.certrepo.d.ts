/// <reference types="q" />
import * as q from 'q';
import { Cert } from './cert.classes.cert';
export interface ICertRepoConstructorOptions {
    sslDirPath: string;
    gitOriginRepo: string;
    certInstance: Cert;
}
export declare class CertRepo {
    private _sslDirPath;
    private _gitOriginRepo;
    private _certInstance;
    constructor(optionsArg: ICertRepoConstructorOptions);
    /**
     * syncs an objectmap of Certificates with repo
     */
    syncFs(): q.Promise<{}>;
    /**
     * Pulls already requested certificates from git origin
     */
    sslGitOriginPull: () => void;
    /**
     * Pushes all new requested certificates to git origin
     */
    sslGitOriginAddCommitPush: () => void;
}
