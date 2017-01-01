import * as q from 'q'
import { GitRepo } from 'smartgit'

import * as plugins from './cert.plugins'
import * as paths from './cert.paths'

import { Cert } from './cert.classes.cert'
import { Certificate } from './cert.classes.certificate'

export interface ICertRepoConstructorOptions {
    sslDirPath: string
    remoteGitUrl: string
    certInstance: Cert
}

export class CertRepo {
    private _sslDirPath: string
    private _remoteGitUrl: string
    private gitRepo: GitRepo
    private _certInstance: Cert
    constructor(optionsArg: ICertRepoConstructorOptions) {
        this._sslDirPath = optionsArg.sslDirPath
        this._remoteGitUrl = optionsArg.remoteGitUrl
        this._certInstance = optionsArg.certInstance

        // setup sslDir
        if (!this._sslDirPath) {
            this._sslDirPath = paths.defaultSslDir
        }
    }

    /**
     * setup the Cert instance
     */
    setup() {
        // setup Git
        let done = q.defer()
        if (this._remoteGitUrl) {
            plugins.smartfile.fs.ensureEmptyDirSync(paths.defaultSslDir)
            plugins.smartgit.createRepoFromClone(this._remoteGitUrl, paths.defaultSslDir)
                .then(gitRepoArg => {
                    this.gitRepo = gitRepoArg
                    done.resolve()
                })
        }
        return done.promise
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
        if (this.gitRepo) {
            this.gitRepo.pull('origin', 'master')
        }
    }

    /**
     * Pushes all new requested certificates to git origin
     */
    sslGitOriginAddCommitPush = () => {
        if (this._remoteGitUrl) {
            this.gitRepo.addAll()
            this.gitRepo.commit('added new SSL certificates and deleted obsolete ones.')
            this.gitRepo.push('origin', 'master')
        }
    }
}
