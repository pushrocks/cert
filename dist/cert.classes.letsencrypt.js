"use strict";
const q = require("q");
let letsencrypt = require('letsencrypt');
let leStore = require('le-store-certbot');
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
let leStoreConfig = {
    configDir: paths.leConfigDir,
    privkeyPath: ':configDir/:hostname/privkey.pem',
    fullchainPath: ':configDir/:hostname/fullchain.pem',
    certPath: ':configDir/:hostname/cert.pem',
    chainPath: ':configDir/:hostname/chain.pem',
    workDir: ':configDir/letsencrypt/var/lib',
    logsDir: ':configDir/letsencrypt/var/log',
    debug: true
};
let leStoreInstance = leStore.create(leStoreConfig);
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
            store: leStoreInstance,
            agreeToTerms: (opts, agreeCb) => {
                agreeCb(null, opts.tosUrl);
            },
            debug: true,
            log: function (debug) {
                console.info(arguments);
            }
        });
        console.log();
    }
    /**
     * register a domain
     */
    registerDomain(domainNameArg) {
        plugins.beautylog.log(`trying to register domain ${domainNameArg}`);
        let done = q.defer();
        plugins.smartfile.fs.ensureDirSync(plugins.path.join(paths.leConfigDir, 'live', domainNameArg));
        this._leInstance.check({ domains: [domainNameArg] }).then((cert) => {
            console.log(cert);
            let opts = {
                domains: [domainNameArg],
                email: 'domains@lossless.org',
                agreeTos: true,
                rsaKeySize: 2048,
                challengeType: 'dns-01',
                duplicate: true
            };
            if (cert) {
                if (true) {
                    return this._leInstance.renew(opts, cert).catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    return cert;
                }
            }
            else {
                // Register Certificate manually
                return this._leInstance.register(opts).catch((err) => {
                    console.log(err);
                });
            }
        });
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
            loopback: (defaults, domain, token, keyAuthorization, done) => {
                done();
            },
            test: (defaults, domain, challenge, cb) => {
                cb();
            }
        };
    }
}
exports.Letsencrypt = Letsencrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmxldHNlbmNyeXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFDdEIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3hDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBRXpDLDBDQUF5QztBQUN6QyxzQ0FBcUM7QUFZckMsSUFBSSxhQUFhLEdBQUc7SUFDaEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXO0lBQzVCLFdBQVcsRUFBRSxrQ0FBa0M7SUFDL0MsYUFBYSxFQUFFLG9DQUFvQztJQUNuRCxRQUFRLEVBQUUsK0JBQStCO0lBQ3pDLFNBQVMsRUFBRSxnQ0FBZ0M7SUFFM0MsT0FBTyxFQUFFLGdDQUFnQztJQUN6QyxPQUFPLEVBQUUsZ0NBQWdDO0lBRXpDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQTtBQUVELElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7QUFFbkQ7SUFRSSxZQUFZLFVBQTBDO1FBQ2xELGtCQUFrQjtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUE7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUE7UUFFL0IsOEJBQThCO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQTtRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFL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