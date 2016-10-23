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
            challenges: { 'dns-01': this._leChallengeHandler() },
            challengeType: 'dns-01',
            configDir: paths.leConfigDir,
            privkeyPath: ':configDir/live/:hostname/privkey.pem',
            fullchainPath: ':configDir/live/:hostname/fullchain.pem',
            certPath: ':config/live/:hostname/cert.pem',
            chainPath: ':config/live/:hostname/chain.pem',
            agreeToTerms: this._leAgree,
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
        this._leInstance.register({
            domains: [domainNameArg],
            email: 'domains@lossless.org',
            agreeTos: true,
            rsaKeySize: 2048,
            challengeType: 'dns-01'
        }).then((results) => {
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
        return done.promise;
    }
    /**
     * translates to the format expected by letsencrypt node implementation
     */
    _leChallengeHandler() {
        return {
            getOptions: (...args) => {
                return {
                    debug: true
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
                console.log(defaults);
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
            loopback: (args, domain, challenge, cb) => {
                console.log(args);
                console.log(domain);
                console.log(challenge);
                cb();
            },
            test: (defaults, domain, challenge, cb) => {
                cb();
            }
        };
    }
    _leAgree(opts, agreeCb) {
        // opts = { email, domains, tosUrl } 
        agreeCb(null, opts.tosUrl);
    }
}
exports.Letsencrypt = Letsencrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFDdEIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBRXhDLDBDQUF5QztBQUN6QyxzQ0FBcUM7QUFZckM7SUFRSSxZQUFZLFVBQTBDO1FBQ2xELGtCQUFrQjtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUE7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUE7UUFFL0IsOEJBQThCO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQTtRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNwRCxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDekIsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFO1lBQ3BELGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM1QixXQUFXLEVBQUUsdUNBQXVDO1lBQ3BELGFBQWEsRUFBRSx5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