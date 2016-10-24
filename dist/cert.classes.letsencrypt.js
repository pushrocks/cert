"use strict";
const q = require("q");
let letsencrypt = require('letsencrypt');
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
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
                'http-01': this._leChallengeHandler(),
                'dns-01': this._leChallengeHandler(),
            },
            challengeType: 'dns-01',
            configDir: paths.leConfigDir,
            privkeyPath: ':configDir/live/:hostname/privkey.pem',
            fullchainPath: ':configDir/live/:hostname/fullchain.pem',
            certPath: ':configDir/live/:hostname/cert.pem',
            chainPath: ':configDir/live/:hostname/chain.pem',
            agreeToTerms: (opts, agreeCb) => {
                agreeCb(null, opts.tosUrl);
            },
            debug: true
        });
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
                cb();
            },
            test: (defaults, domain, challenge, cb) => {
                cb();
            }
        };
    }
}
exports.Letsencrypt = Letsencrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFDdEIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBRXhDLDBDQUF5QztBQUN6QyxzQ0FBcUM7QUFZckM7SUFRSSxZQUFZLFVBQTBDO1FBQ2xELGtCQUFrQjtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUE7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUE7UUFFL0IsOEJBQThCO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQTtRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNwRCxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDekIsVUFBVSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7YUFDdkM7WUFDRCxhQUFhLEVBQUUsUUFBUTtZQUN2QixTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVc7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