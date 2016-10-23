/// <reference types="q" />
export interface IChallengehandlerConstructorOptions {
    cfEmail: string;
    cfKey: string;
}
/**
 * class ChallengeHandler handles challenges
 */
export declare class ChallengeHandler {
    private _cfInstance;
    constructor(optionsArg: IChallengehandlerConstructorOptions);
    /**
     * set a challenge
     */
    setChallenge(domainNameArg: string, challengeArg: string): Q.Promise<{}>;
    /**
     * cleans a challenge
     */
    cleanChallenge(domainNameArg: any): Q.Promise<{}>;
}
