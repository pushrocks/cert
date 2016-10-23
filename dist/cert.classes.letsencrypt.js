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
            agreeToTerms: (opts, agreeCb) => {
                agreeCb(null, opts.tosUrl);
            },
            debug: false
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
            rsaKeySize: 2048
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
}
exports.Letsencrypt = Letsencrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFDdEIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBRXhDLDBDQUF5QztBQUN6QyxzQ0FBcUM7QUFZckM7SUFRSSxZQUFZLFVBQTBDO1FBQ2xELGtCQUFrQjtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUE7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUE7UUFFL0IsOEJBQThCO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQTtRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNwRCxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDekIsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFO1lBQ3BELGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM1QixXQUFXLEVBQUUsdUNBQXVDO1lBQ3BELGFBQWEsRUFBRSx5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