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
            if (this._gitOriginRepo) {
                plugins.smartgit.pull(this._sslDirPath, 'origin', 'master');
            }
        };
        /**
         * Pushes all new requested certificates to git origin
         */
        this.sslGitOriginAddCommitPush = () => {
            if (this._gitOriginRepo) {
                plugins.smartgit.add.addAll(this._sslDirPath);
                plugins.smartgit.commit(this._sslDirPath, 'added new SSL certificates and deleted obsolete ones.');
                plugins.smartgit.push(this._sslDirPath, 'origin', 'master');
            }
        };
        this._sslDirPath = optionsArg.sslDirPath;
        this._gitOriginRepo = optionsArg.gitOriginRepo;
        this._certInstance = optionsArg.certInstance;
        // setup sslDir
        if (!this._sslDirPath) {
            this._sslDirPath = paths.defaultSslDir;
        }
        // setup Git
        if (this._gitOriginRepo) {
            plugins.smartgit.init(this._sslDirPath);
            plugins.smartgit.remote.add(this._sslDirPath, 'origin', this._gitOriginRepo);
            this.sslGitOriginPull();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnRyZXBvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmNlcnRyZXBvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFFdEIsMENBQXlDO0FBQ3pDLHNDQUFxQztBQVdyQztJQUlJLFlBQVksVUFBdUM7UUEyQm5EOztXQUVHO1FBQ0gscUJBQWdCLEdBQUc7WUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDL0QsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVEOztXQUVHO1FBQ0gsOEJBQXlCLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7Z0JBQzdDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsdURBQXVELENBQUMsQ0FBQTtnQkFDbEcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDL0QsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQTVDRyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUE7UUFDeEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFBO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQTtRQUU1QyxlQUFlO1FBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUEsQ0FBQztZQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUE7UUFDMUMsQ0FBQztRQUVELFlBQVk7UUFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN0QixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDdkMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUM1RSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUMzQixDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTTtRQUNGLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUN2QixDQUFDO0NBcUJKO0FBbERELDRCQWtEQyJ9