/// <reference types="q" />
import * as q from 'q';
import { ChallengeHandler } from './cert.classes.challengehandler';
export declare type TLeEnv = 'production' | 'staging';
export interface ILetsencryptConstructorOptions {
    leEnv: TLeEnv;
    challengeHandler: ChallengeHandler;
    sslDir: string;
}
export declare class Letsencrypt {
    leEnv: TLeEnv;
    challengeHandler: ChallengeHandler;
    sslDir: string;
    private _leInstance;
    private _leServerUrl;
    constructor(optionsArg: ILetsencryptConstructorOptions);
    /**
     * register a domain
     */
    registerDomain(domainNameArg: string): q.Promise<{}>;
    private _leCopyToDestination(domainNameArg);
    /**
     * translates to the format expected by letsencrypt node implementation
     */
    private _leChallengeHandler();
    private _leAgree(opts, agreeCb);
}
