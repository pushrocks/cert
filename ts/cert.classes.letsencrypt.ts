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

export class Letsencrypt {
    leEnv: TLeEnv
    challengeHandler: ChallengeHandler // this is the format we use
    sslDir: string
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

    }

    /**
     * register a domain
     */
    registerDomain(domainNameArg: string) {
        plugins.beautylog.log(`trying to register domain ${domainNameArg}`)
        let done = q.defer()
        plugins.smartfile.fs.ensureDirSync(plugins.path.join(paths.leConfigDir, 'live', domainNameArg))
        return done.promise
    }
}
