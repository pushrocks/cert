"use strict";
const q = require("q");
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
let letsencrypt = require('letsencrypt');
let leStore = require('le-store-certbot').create({
    configDir: paths.leConfigDir,
    debug: false
});
class Letsencrypt {
    constructor(optionsArg) {
        // determine leEnv
        this.leEnv = optionsArg.leEnv;
        this.challengeHandler = optionsArg.challengeHandler;
        this.sslDir = optionsArg.sslDir;
        // set letsencrypt environment
        if (this.leEnv === 'production') {
            this._leServerUrl = letsencrypt.productionServerUrl;
        }
        else if (this.leEnv === 'staging') {
            this._leServerUrl = letsencrypt.stagingServerUrl;
        }
        // create leInstance
        this._leInstance = letsencrypt.create({
            server: this._leServerUrl,
            challenges: {
                'dns-01': this._leChallengeHandler()
            },
            challengeType: 'dns-01',
            store: leStore,
            agreeToTerms: (opts, agreeCb) => {
                agreeCb(null, opts.tosUrl);
            },
            debug: true
        });
        console.log();
    }
    /**
     * register a domain
     */
    registerDomain(domainNameArg) {
        plugins.beautylog.log(`trying to register domain ${domainNameArg}`);
        let done = q.defer();
        console.log('test');
        console.log(this._leServerUrl);
        this._leInstance.register({
            domains: [domainNameArg],
            email: 'office@lossless.com',
            agreeTos: true,
            rsaKeySize: 2048,
            challengeType: 'dns-01'
        }).then(results => {
            plugins.beautylog.success(`Got certificates for ${domainNameArg}`);
            this._leCopyToDestination(domainNameArg).then(done.resolve);
        }, (err) => {
            console.error('[Error]: node-letsencrypt/examples/standalone');
            console.error(err.stack);
            done.resolve();
        }).catch(err => { console.log(err); });
        return done.promise;
    }
    // --------------------------------------------
    // Translate for official letsencrypt stuff
    // --------------------------------------------
    _leCopyToDestination(domainNameArg) {
        let done = q.defer();
        done.resolve();
        return done.promise;
    }
    /**
     * translates to the format expected by letsencrypt node implementation
     */
    _leChallengeHandler() {
        return {
            getOptions: () => {
                return {
                    debug: false
                };
            },
            set: (args, domain, challenge, keyAuthorization, cb) => {
                let keyAuthDigest = require('crypto')
                    .createHash('sha256').update(keyAuthorization || '')
                    .digest('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/g, '');
                this.challengeHandler.setChallenge(domain, keyAuthDigest)
                    .then(() => {
                    cb();
                });
            },
            get: (defaults, domain, challenge, cb) => {
                console.log(domain);
                console.log(challenge);
                cb();
            },
            remove: (args, domain, challenge, cb) => {
                this.challengeHandler.cleanChallenge(domain)
                    .then(() => {
                    cb();
                });
            },
            loopback: (defaults, domain, challenge, done) => {
                done();
            },
            test: (defaults, domain, challenge, cb) => {
                cb();
            }
        };
    }
}
exports.Letsencrypt = Letsencrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFFdEIsMENBQXlDO0FBQ3pDLHNDQUFxQztBQUVyQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDeEMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzdDLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVztJQUM1QixLQUFLLEVBQUUsS0FBSztDQUNmLENBQUMsQ0FBQTtBQVlGO0lBUUksWUFBWSxVQUEwQztRQUNsRCxrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFBO1FBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUE7UUFDbkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFBO1FBRS9CLDhCQUE4QjtRQUM5QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsbUJBQW1CLENBQUE7UUFDdkQsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUE7UUFDcEQsQ0FBQztRQUVELG9CQUFvQjtRQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ3pCLFVBQVUsRUFBRTtnQkFDUixRQUFR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