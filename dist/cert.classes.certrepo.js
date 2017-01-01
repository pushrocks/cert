"use strict";
const q = require("q");
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
class CertRepo {
    constructor(optionsArg) {
        /**
         * Pulls already requested certificates from git origin
         */
        this.sslGitOriginPull = () => {
            if (this.gitRepo) {
                this.gitRepo.pull('origin', 'master');
            }
        };
        /**
         * Pushes all new requested certificates to git origin
         */
        this.sslGitOriginAddCommitPush = () => {
            if (this._remoteGitUrl) {
                this.gitRepo.addAll();
                this.gitRepo.commit('added new SSL certificates and deleted obsolete ones.');
                this.gitRepo.push('origin', 'master');
            }
        };
        this._sslDirPath = optionsArg.sslDirPath;
        this._remoteGitUrl = optionsArg.remoteGitUrl;
        this._certInstance = optionsArg.certInstance;
        // setup sslDir
        if (!this._sslDirPath) {
            this._sslDirPath = paths.defaultSslDir;
        }
    }
    /**
     * setup the Cert instance
     */
    setup() {
        // setup Git
        let done = q.defer();
        if (this._remoteGitUrl) {
            plugins.smartfile.fs.ensureEmptyDirSync(paths.defaultSslDir);
            plugins.smartgit.createRepoFromClone(this._remoteGitUrl, paths.defaultSslDir)
                .then(gitRepoArg => {
                this.gitRepo = gitRepoArg;
                done.resolve();
            });
        }
        return done.promise;
    }
    /**
     * syncs an objectmap of Certificates with repo
     */
    syncFs() {
        let done = q.defer();
        done.resolve();
        return done.promise;
    }
}
exports.CertRepo = CertRepo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnRyZXBvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmNlcnRyZXBvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFHdEIsMENBQXlDO0FBQ3pDLHNDQUFxQztBQVdyQztJQUtJLFlBQVksVUFBdUM7UUFxQ25EOztXQUVHO1FBQ0gscUJBQWdCLEdBQUc7WUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDekMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVEOztXQUVHO1FBQ0gsOEJBQXlCLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHVEQUF1RCxDQUFDLENBQUE7Z0JBQzVFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUN6QyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBdERHLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUE7UUFDNUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFBO1FBRTVDLGVBQWU7UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQTtRQUMxQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNELFlBQVk7UUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDckIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQzVELE9BQU8sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDO2lCQUN4RSxJQUFJLENBQUMsVUFBVTtnQkFDWixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQTtnQkFDekIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ2xCLENBQUMsQ0FBQyxDQUFBO1FBQ1YsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07UUFDRixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdkIsQ0FBQztDQXFCSjtBQTdERCw0QkE2REMifQ==