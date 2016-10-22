import * as q from 'q'
import * as plugins from './cert.plugins'
import * as paths from './cert.paths'
import * as helpers from './cert.classes.cert.helpers'

export interface ICertConstructorOptions {
    cfEmail: string,
    cfKey: string,
    sslDir?: string,
    gitOriginRepo?: string,
    testMode?: boolean
}

export class Cert {
    domainCertRequestMap: plugins.lik.Stringmap = new plugins.lik.Stringmap()
    certificatesPresent: Certificate[]
    certificatesValid: Certificate[]
    private _cfEmail: string
    private _cfKey: string
    private _sslDir: string
    private _gitOriginRepo: string
    private _testMode: boolean

    /**
     * Constructor for Cert object
     */
    constructor(optionsArg: ICertConstructorOptions) {
        this._cfEmail = optionsArg.cfEmail
        this._cfKey = optionsArg.cfKey
        this._sslDir = optionsArg.sslDir
        this._gitOriginRepo = optionsArg.gitOriginRepo
        this._testMode = optionsArg.testMode
        // write hook config
        let config = {
            cfEmail: this._cfEmail,
            cfKey: this._cfKey
        }
        plugins.smartfile.memory.toFsSync(
            JSON.stringify(config),
            plugins.path.join(__dirname, 'assets/config.json')
        )
        // setup sslDir
        if (!this._sslDir) this._sslDir = paths.defaultSslDir
        // setup Git
        if (this._gitOriginRepo) {
            plugins.smartgit.init(this._sslDir)
            plugins.smartgit.remote.add(this._sslDir, 'origin', this._gitOriginRepo)
            this.sslGitOriginPull()
        }
    }

    /**
     * Pulls already requested certificates from git origin
     */
    sslGitOriginPull = () => {
        if (this._gitOriginRepo) {
            plugins.smartgit.pull(this._sslDir, 'origin', 'master')
        }
    }

    /**
     * Pushes all new requested certificates to git origin
     */
    sslGitOriginAddCommitPush = () => {
        if (this._gitOriginRepo) {
            plugins.smartgit.add.addAll(this._sslDir)
            plugins.smartgit.commit(this._sslDir, 'added new SSL certificates and deleted obsolete ones.')
            plugins.smartgit.push(this._sslDir, 'origin', 'master')
        }
    }

    /**
     * gets a ssl cert for a given domain
     */
    getDomainCert(domainNameArg: string, optionsArg: { force: boolean } = { force: false }) {
        let done = q.defer()
        let domainStringData = new plugins.smartstring.Domain(domainNameArg)
        let sameZoneRequesting: boolean = this.domainCertRequestMap.checkMinimatch('*' + domainStringData.zoneName)
        // make sure no one else requires the same domain at the same time
        if (!this.domainCertRequestMap.checkString(domainNameArg)) {
            this.domainCertRequestMap.addString(domainNameArg)
            if (!helpers.checkDomainsStillValid(domainNameArg, this._sslDir) || optionsArg.force) {
                if (!sameZoneRequesting) {
                    this.sslGitOriginPull()
                    plugins.smartfile.fs.ensureDir(paths.certDir)
                    plugins.beautylog.info(`getting cert for ${domainNameArg}`)
                    plugins.shelljs.exec(
                        `bash -c "${paths.letsencryptSh} -c --no-lock -f ${paths.leShConfig} -d ${domainNameArg} -t dns-01 -k ${paths.certHook} -o ${paths.certDir}"`,
                        {
                            silent: true
                        },
                        (codeArg, stdoutArg) => {
                            if (codeArg === 0) {
                                console.log(stdoutArg)
                                let fetchedCertsArray: string[] = plugins.smartfile.fs.listFoldersSync(paths.certDir)
                                if (fetchedCertsArray.indexOf(domainNameArg) != -1) {
                                    helpers.updateSslDirSync(this._sslDir, domainNameArg)
                                    plugins.smartfile.fs.removeSync(plugins.path.join(paths.certDir, domainNameArg))
                                    this.sslGitOriginAddCommitPush()
                                } else {
                                    plugins.beautylog.error(`Couldn't copy final certificate for ${domainNameArg}!`)
                                }
                                done.resolve()
                            } else {
                                plugins.beautylog.warn(`${domainNameArg} scheduled for retry. Waiting 1 minute!`)
                                helpers.scheduleRetry(domainNameArg, this).then(done.resolve)
                            }
                            this.domainCertRequestMap.removeString(domainNameArg)
                        }
                    )
                } else {
                    plugins.beautylog.info(`${domainNameArg} is waiting for domains names of same zone to finish`)
                    this.domainCertRequestMap.removeString(domainNameArg)
                    this.domainCertRequestMap.registerUntilTrue(
                        () => {
                            return !this.domainCertRequestMap.checkMinimatch('*' + domainStringData.zoneName)
                        },
                        () => {
                            this.getDomainCert(domainNameArg).then(done.resolve)
                        }
                    )
                }
            } else {
                plugins.beautylog.info('certificate for ' + domainNameArg + ' is still valid! Not fetching new one!')
                this.domainCertRequestMap.removeString(domainNameArg)
                done.resolve()
            }
        } else {
            plugins.beautylog.warn(`${domainNameArg} is already requesting`)
        }

        return done.promise
    }
    cleanOldCertificates() {

    }
}

export class Certificate {
    domainName: string
    creationDate: Date
    expiryDate: Date
    constructor() {

    }
}

