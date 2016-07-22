/// <reference types="q" />
import { Cert } from "./index.ts";
import * as plugins from "./cert.plugins";
export declare let accountsKeyPresent: () => plugins.q.Promise<{}>;
export declare let scheduleRetry: (domainArg: string, certClassArg: Cert) => plugins.q.Promise<{}>;
