import * as q from 'q'
import { Stringmap, Objectmap } from 'lik'

import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

// classes
import { Certificate } from './cert.classes.certificate'
import { CertRepo } from './cert.classes.certrepo'
import { Letsencrypt, TLeEnv } from './cert.classes.letsencrypt'
import { ChallengeHandler } from './cert.classes.challengehandler'


export interface ICertConstructorOptions {
    cfEmail: string,
    cfKey: string,
    sslDirPath?: string,
    gitOriginRepo?: string,
    leEnv?: TLeEnv
}

export class Cert {
    domainStringRequestMap = new Stringmap()
    certificateMap = new Objectmap<Certificate>()
    letsencrypt: Letsencrypt
    private _challengeHandler: ChallengeHandler
    private _certRepo: CertRepo

    /**
     * Constructor for Cert object
     */
    constructor(optionsArg: ICertConstructorOptions) {

        // set up challengehandler
        this._challengeHandler = new ChallengeHandler({
            cfEmail: optionsArg.cfEmail,
            cfKey: optionsArg.cfKey
        })

        // setup Letsencrypt
        this.letsencrypt = new Letsencrypt({
            leEnv: optionsArg.leEnv,
            sslDir: optionsArg.sslDirPath,
            challengeHandler: this._challengeHandler
        })

        // setup CertRpo
        this._certRepo = new CertRepo({
            sslDirPath: optionsArg.sslDirPath,
            gitOriginRepo: optionsArg.gitOriginRepo,
            certInstance: this
        })

        this._certRepo
    }

    /**
     * adds a Certificate for a given domain
     */
    addCertificate(domainNameArg: string, optionsArg: { force: boolean } = { force: false }) {
        let done = q.defer()
        let certificateForDomain = this.certificateMap.find((certificate) => {
            return certificate.domainName === domainNameArg
        })
        if (certificateForDomain instanceof Certificate) {
            certificateForDomain.renew()
                .then(done.resolve)
        } else {
            certificateForDomain = new Certificate({
                certInstance: this,
                domainName: domainNameArg
            })
            certificateForDomain.renew()
                .then(done.resolve)
        }
        return done.promise
    }

    /**
     * cleans up old certificates
     */
    cleanOldCertificates() {

    }

    /**
     * executes the current batch of jobs
     */
    deploy() {

    }
}
