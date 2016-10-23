import * as q from 'q'
let letsencrypt = require('letsencrypt')

import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

import { ChallengeHandler } from './cert.classes.challengehandler'

export type TLeEnv = 'production' | 'staging'

export interface ILetsencryptConstructorOptions {
    leEnv: TLeEnv,
    challengeHandler: ChallengeHandler,
    sslDir: string
}

export class Letsencrypt {
    leEnv: TLeEnv
    challengeHandler: ChallengeHandler // this is the format we use
    sslDir: string

    private _leInstance: any
    private _leServerUrl: string

    constructor(optionsArg: ILetsencryptConstructorOptions) {
        // determine leEnv
        this.leEnv = optionsArg.leEnv
        this.challengeHandler = optionsArg.challengeHandler
        this.sslDir = optionsArg.sslDir

        // set letsencrypt environment
        if (this.leEnv === 'production') {
            this._leServerUrl = letsencrypt.productionServerUrl
        } else if (this.leEnv === 'staging') {
            this._leServerUrl = letsencrypt.stagingServerUrl
        }

        // create leInstance
        this._leInstance = letsencrypt.create({
            server: this._leServerUrl,
            challenges: { 'dns-01': this._leChallengeHandler() },
            challengeType: 'dns-01',
            configDir: paths.leConfigDir,
            privkeyPath: ':configDir/live/:hostname/privkey.pem', //
            fullchainPath: ':configDir/live/:hostname/fullchain.pem', // Note: both that :config and :hostname
            certPath: ':config/live/:hostname/cert.pem', // will be templated as expected
            chainPath: ':config/live/:hostname/chain.pem',
            agreeToTerms: this._leAgree,
            debug: true
        })
    }

    /**
     * register a domain
     */
    registerDomain(domainNameArg: string) {
        plugins.beautylog.log(`trying to register domain ${domainNameArg}`)
        let done = q.defer()
        console.log('test')
        this._leInstance.register({
            domains: [domainNameArg],
            email: 'domains@lossless.org',
            agreeTos: true,
            rsaKeySize: 2048,
            challengeType: 'dns-01'
        }).then(
            (results) => {
                plugins.beautylog.success(`Got certificates for ${domainNameArg}`)
                this._leCopyToDestination(domainNameArg).then(done.resolve)
            },
            (err) => {
                console.error('[Error]: node-letsencrypt/examples/standalone')
                console.error(err.stack)
                done.resolve()
            }
            ).catch(err => { console.log(err) })
        return done.promise
    }

    // --------------------------------------------
    // Translate for official letsencrypt stuff
    // --------------------------------------------

    private _leCopyToDestination(domainNameArg) {
        let done = q.defer()
        return done.promise
    }

    /**
     * translates to the format expected by letsencrypt node implementation
     */
    private _leChallengeHandler() {
        return {
            getOptions: (...args) => {
                return {
                    debug: true
                }
            },
            set: (args, domain, challenge, keyAuthorization, cb) => {
                let keyAuthDigest = require('crypto')
                    .createHash('sha256').update(keyAuthorization || '')
                    .digest('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/g, '')
                this.challengeHandler.setChallenge(domain, keyAuthDigest)
                    .then(() => {
                        cb()
                    })
            },
            get: (defaults, domain, challenge, cb) => {
                console.log(defaults)
                console.log(domain)
                console.log(challenge)
                cb()
            },
            remove: (args, domain, challenge, cb) => {
                this.challengeHandler.cleanChallenge(domain)
                    .then(() => {
                        cb()
                    })
            },
            loopback: (args, domain, challenge, cb) => {
                console.log(args)
                console.log(domain)
                console.log(challenge)
                cb()
            },
            test: (defaults, domain, challenge, cb) => {
                cb()
            }
        }
    }

    private _leAgree(opts, agreeCb) {
        // opts = { email, domains, tosUrl } 
        agreeCb(null, opts.tosUrl);
    }
}
