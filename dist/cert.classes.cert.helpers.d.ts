/// <reference types="q" />
import { Cert } from "./index.ts";
import * as plugins from "./cert.plugins";
/**
 * schedule a retry of certificate request
 */
export declare let scheduleRetry: (domainArg: string, certClassArg: Cert) => plugins.q.Promise<{}>;
/**
 * check if a given domainCert is still valid
 */
export declare let checkDomainsStillValid: (domainNameArg: string, sslDirArg: string) => boolean;
export interface certConfig {
    domainName: string;
    created: number;
    expires: number;
}
/**
 * update a ssl directory
 */
export declare let updateSslDirSync: (sslDirArg: string, domainNameArg: string) => void;
