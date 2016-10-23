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
            certPath: ':configDir/live/:hostname/cert.pem',
            chainPath: ':configDir/live/:hostname/chain.pem',
            agreeToTerms: true,
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
            getOptions: () => {
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
            loopback: (opts, domain, token, keyAuthorization, cb) => {
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