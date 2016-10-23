import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

export interface IChallengehandlerConstructorOptions {
    cfEmail: string,
    cfKey: string,
}

/**
 * class ChallengeHandler handles challenges
 */
export class ChallengeHandler {
    private _cfInstance: plugins.cflare.CflareAccount
    constructor(optionsArg: IChallengehandlerConstructorOptions) {
        this._cfInstance = new plugins.cflare.CflareAccount()
        this._cfInstance.auth({
            email: optionsArg.cfEmail,
            key: optionsArg.cfKey
        })
    }

    /**
     * set a challenge
     */
    setChallenge(domainNameArg: string, challengeArg: string) {
        let done = plugins.q.defer()
        plugins.beautylog.log('setting challenge for ' + domainNameArg)
        this._cfInstance.createRecord(prefixName(domainNameArg), 'TXT', challengeArg).then(() => {
            plugins.beautylog.ok('Challenge has been set!')
            plugins.beautylog.info('We need to cool down to let DNS propagate to edge locations!')
            cooldown().then(() => {
                done.resolve()
            })
        })
        return done.promise
    }

    /**
     * cleans a challenge
     */
    cleanChallenge(domainNameArg) {
        let done = plugins.q.defer()
        plugins.beautylog.log('cleaning challenge for ' + domainNameArg)
        this._cfInstance.removeRecord(prefixName(domainNameArg), 'TXT')
        cooldown().then(() => {
            done.resolve()
        })
        return done.promise
    }
}

/**
 * cooldown timer for letting DNS settle before answering the challengerequest
 */
let cooldown = () => {
    let done = plugins.q.defer()
    let cooldowntime = 60000
    let passedTime = 0
    plugins.beautylog.log('Cooling down! ' + (cooldowntime / 1000).toString() + ' seconds left')
    let coolDownCounter = () => {
        setTimeout(() => {
            if (cooldowntime <= passedTime) {
                plugins.beautylog.ok('Cooled down!')
                done.resolve()
            } else {
                passedTime = passedTime + 5000
                plugins.beautylog.log('Cooling down! '
                    + ((cooldowntime - passedTime) / 1000).toString()
                    + ' seconds left'
                )
                coolDownCounter()
            }
        }, 5000)
    }
    coolDownCounter()
    return done.promise
}

/**
 * prefix a domain name to make sure it complies with letsencrypt
 */
let prefixName = (domainNameArg: string): string => {
    return '_acme-challenge.' + domainNameArg
}
