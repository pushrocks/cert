import * as q from 'q'
let letsencrypt = require('letsencrypt')
let leStore = require('le-store-certbot')

import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

import { ChallengeHandler } from './cert.classes.challengehandler'

export type TLeEnv = 'production' | 'staging'

export interface ILetsencryptConstructorOptions {
    leEnv: TLeEnv,
    challengeHandler: ChallengeHandler,
    sslDir: string
}

let leStoreConfig = {
    configDir: paths.leConfigDir,
    privkeyPath: ':configDir/:hostname/privkey.pem',
    fullchainPath: ':configDir/:hostname/fullchain.pem',
    certPath: ':configDir/:hostname/cert.pem',
    chainPath: ':configDir/:hostname/chain.pem',

    workDir: ':configDir/letsencrypt/var/lib',
    logsDir: ':configDir/letsencrypt/var/log',

    debug: true
}

let leStoreInstance = leStore.create(leStoreConfig)

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
            challenges: {
                'dns-01': this._leChallengeHandler()
            },
            challengeType: 'dns-01',
            store: leStoreInstance,
            agreeToTerms: (opts, agreeCb) => {
                agreeCb(null, opts.tosUrl)
            },
            debug: true,
            log: function (debug) {
                console.info(arguments)
            }
        })
        console.log()
    }

    /**
     * register a domain
     */
    registerDomain(domainNameArg: string) {
        plugins.beautylog.log(`trying to register domain ${domainNameArg}`)
        let done = q.defer()
        plugins.smartfile.fs.ensureDirSync(plugins.path.join(paths.leConfigDir, 'live', domainNameArg))
        this._leInstance.check({ domains: [domainNameArg] }).then((cert) => {
            console.log(cert)
            let opts = {
                domains: [domainNameArg],
                email: 'domains@lossless.org',
                agreeTos: true,
                rsaKeySize: 2048,                                       // 2048 or higher
                challengeType: 'dns-01',
                duplicate: true
            }

            if (cert) {
                if (true) {
                    return this._leInstance.renew(opts, cert).catch((err) => {
                        console.log(err)
                    })
                } else {
                    return cert
                }
            } else {
                // Register Certificate manually
                return this._leInstance.register(opts).catch((err) => {
                    console.log(err)
                })
            }
        })
        return done.promise
    }

    // --------------------------------------------
    // Translate for official letsencrypt stuff
    // --------------------------------------------

    private _leCopyToDestination(domainNameArg) {
        let done = q.defer()
        done.resolve()
        return done.promise
    }

    /**
     * translates to the format expected by letsencrypt node implementation
     */
    private _leChallengeHandler() {
        return {
            getOptions: () => {
                return {
                    debug: false
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
            loopback: (defaults, domain, token, keyAuthorization, done) => {
                done()
            },
            test: (defaults, domain, challenge, cb) => {
                cb()
            }
        }
    }
}
