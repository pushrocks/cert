/// <reference types="q" />
import * as q from 'q';
import { Stringmap, Objectmap } from 'lik';
import { Certificate } from './cert.classes.certificate';
import { Letsencrypt, TLeEnv } from './cert.classes.letsencrypt';
export interface ICertConstructorOptions {
    cfEmail: string;
    cfKey: string;
    sslDirPath?: string;
    gitOriginRepo?: string;
    leEnv?: TLeEnv;
}
export declare class Cert {
    domainStringRequestMap: Stringmap;
    certificateMap: Objectmap<Certificate>;
    letsencrypt: Letsencrypt;
    private _challengeHandler;
    private _certRepo;
    /**
     * Constructor for Cert object
     */
    constructor(optionsArg: ICertConstructorOptions);
    /**
     * adds a Certificate for a given domain
     */
    addCertificate(domainNameArg: string, optionsArg?: {
        force: boolean;
    }): q.Promise<{}>;
    /**
     * cleans up old certificates
     */
    cleanOldCertificates(): void;
    /**
     * executes the current batch of jobs
     */
    deploy(): void;
}
