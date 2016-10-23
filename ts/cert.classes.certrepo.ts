import * as q from 'q'

import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

import { Cert } from './cert.classes.cert'
import { Certificate } from './cert.classes.certificate'

export interface ICertRepoConstructorOptions {
    sslDirPath: string
    gitOriginRepo: string
    certInstance: Cert
}

export class CertRepo {
    private _sslDirPath: string
    private _gitOriginRepo: string
    private _certInstance: Cert
    constructor(optionsArg: ICertRepoConstructorOptions) {
        this._sslDirPath = optionsArg.sslDirPath
        this._gitOriginRepo = optionsArg.gitOriginRepo
        this._certInstance = optionsArg.certInstance

        // setup sslDir
        if (!this._sslDirPath){
            this._sslDirPath = paths.defaultSslDir
        }

        // setup Git
        if (this._gitOriginRepo) {
            plugins.smartgit.init(this._sslDirPath)
            plugins.smartgit.remote.add(this._sslDirPath, 'origin', this._gitOriginRepo)
            this.sslGitOriginPull()
        }
    }

    /**
     * syncs an objectmap of Certificates with repo
     */
    syncFs() {
        let done = q.defer()
        done.resolve()
        return done.promise
    }

    /**
     * Pulls already requested certificates from git origin
     */
    sslGitOriginPull = () => {
        if (this._gitOriginRepo) {
            plugins.smartgit.pull(this._sslDirPath, 'origin', 'master')
        }
    }

    /**
     * Pushes all new requested certificates to git origin
     */
    sslGitOriginAddCommitPush = () => {
        if (this._gitOriginRepo) {
            plugins.smartgit.add.addAll(this._sslDirPath)
            plugins.smartgit.commit(this._sslDirPath, 'added new SSL certificates and deleted obsolete ones.')
            plugins.smartgit.push(this._sslDirPath, 'origin', 'master')
        }
    }
}
