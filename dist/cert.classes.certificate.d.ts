/// <reference types="q" />
import * as q from 'q';
import * as plugins from './cert.plugins';
import { Cert } from './cert.classes.cert';
export interface ICertificateFsConfig {
    domainName: string;
    creationTime: number;
    expiryTime: number;
}
export interface ICertificateConstructorOptions {
    domainName: string;
    certInstance: Cert;
}
export declare type TCertificateStatus = 'unregistered' | 'valid' | 'expiring' | 'expired';
export declare class Certificate {
    domainName: string;
    certInstance: Cert;
    domainData: plugins.smartstring.Domain;
    creationDate: Date;
    expiryDate: Date;
    publicKey: string;
    privKey: string;
    /**
     * run when creating a new instance of Certificate
     */
    constructor(optionsArg: ICertificateConstructorOptions);
    /**
     * the status of the Certificate
     */
    readonly status: TCertificateStatus;
    readonly sameZoneRequesting: boolean;
    /**
     * schedule a retry of certificate request
     */
    scheduleRetry(): q.Promise<{}>;
    /**
     * renew certificate if needed
     */
    renew(force?: boolean): q.Promise<{}>;
    /**
     * syncFs syncs the certificate with disk
     */
    syncFs(): void;
    /**
     * deletes the certificate
     */
    delete(): void;
}
