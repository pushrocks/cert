import * as q from 'q'

import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

// import classes
import { Cert } from './cert.classes.cert'
import { Letsencrypt } from './cert.classes.letsencrypt'
import { CertRepo } from './cert.classes.certrepo'

export interface ICertificateFsConfig {
    domainName: string
    creationTime: number
    expiryTime: number
}

export interface ICertificateConstructorOptions {
    domainName: string,
    certInstance: Cert
}

export type TCertificateStatus = 'unregistered' | 'valid' | 'expiring' | 'expired'

export class Certificate {
    domainName: string
    certInstance: Cert
    domainData: plugins.smartstring.Domain
    creationDate: Date = null
    expiryDate: Date = null
    publicKey: string = null
    privKey: string = null

    /**
     * run when creating a new instance of Certificate
     */
    constructor(optionsArg: ICertificateConstructorOptions) {
        this.domainName = optionsArg.domainName
        this.domainData = new plugins.smartstring.Domain(this.domainName)
        this.certInstance = optionsArg.certInstance
    }

    /**
     * the status of the Certificate
     */
    get status(): TCertificateStatus {
        let validTimeRemaining: number = 0
        if (this.creationDate !== null && this.expiryDate !== null) {
             validTimeRemaining = this.expiryDate.getTime() - Date.now()
        }
        let MonthMilliseconds = 2629746000
        if (this.publicKey === null || this.privKey === null) {
            return 'unregistered'
        } else if (validTimeRemaining >= MonthMilliseconds) {
            return 'valid'
        } else if (validTimeRemaining < MonthMilliseconds && validTimeRemaining >= 0) {
            return 'expiring'
        } else {
            return 'expired'
        }
    }

    get sameZoneRequesting(): boolean {
        return this.certInstance.domainStringRequestMap.checkMinimatch('*' + this.domainData.zoneName)
    }

    /**
     * schedule a retry of certificate request
     */
    scheduleRetry() {
        let done = plugins.q.defer()
        setTimeout(() => {
            this.renew()
                .then(done.resolve)
        }, 60000)
        return done.promise
    }

    /**
     * renew certificate if needed
     */
    renew(force: boolean = false) {
        let done = q.defer()
        if (this.status === 'valid') {
            plugins.beautylog.log('Certificate still valid for more than 1 month, so it is not renewed now')
            done.resolve()
        } else if (this.status === 'expiring' || this.status === 'expired' || this.status === 'unregistered') {
            plugins.beautylog.info('Certificate not valid currently, going to renew now!')
            if (this.sameZoneRequesting) {
                this.certInstance.domainStringRequestMap.registerUntilTrue(
                        () => {
                            return !this.sameZoneRequesting
                        },
                        () => {
                            this.renew().then(done.resolve)
                        }
                    )
            } else {
                this.certInstance.letsencrypt.registerDomain(this.domainName)
                    .then(() => {
                        return this.syncFs()
                    })
                    .then(() => {
                        done.resolve()
                    }).catch((err) => { console.log(err) })
            }
        } else {
            throw Error(`weird status for certificate with domain name ${this.domainName}`)
        }
        done.resolve()
        return done.promise
    }

    /**
     * syncFs syncs the certificate with disk
     */
    syncFs() {
        let configJsonMemory: ICertificateFsConfig = {
            domainName: this.domainName,
            creationTime: this.creationDate.getTime(),
            expiryTime: this.expiryDate.getTime()
        }

    }

    /**
     * deletes the certificate
     */
    delete() { }
}
