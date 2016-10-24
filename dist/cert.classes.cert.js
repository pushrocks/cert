"use strict";
const q = require("q");
const lik_1 = require("lik");
// classes
const cert_classes_certificate_1 = require("./cert.classes.certificate");
const cert_classes_letsencrypt_1 = require("./cert.classes.letsencrypt");
const cert_classes_challengehandler_1 = require("./cert.classes.challengehandler");
class Cert {
    /**
     * Constructor for Cert object
     */
    constructor(optionsArg) {
        this.domainStringRequestMap = new lik_1.Stringmap();
        this.certificateMap = new lik_1.Objectmap();
        // set up challengehandler
        this._challengeHandler = new cert_classes_challengehandler_1.ChallengeHandler({
            cfEmail: optionsArg.cfEmail,
            cfKey: optionsArg.cfKey
        });
        // setup Letsencrypt
        this.letsencrypt = new cert_classes_letsencrypt_1.Letsencrypt({
            leEnv: optionsArg.leEnv,
            sslDir: optionsArg.sslDirPath,
            challengeHandler: this._challengeHandler
        });
        // setup CertRpo
        /* this._certRepo = new CertRepo({
            sslDirPath: optionsArg.sslDirPath,
            gitOriginRepo: optionsArg.gitOriginRepo,
            certInstance: this
        }) */
    }
    /**
     * adds a Certificate for a given domain
     */
    addCertificate(domainNameArg, optionsArg = { force: false }) {
        let done = q.defer();
        let certificateForDomain = this.certificateMap.find((certificate) => {
            return certificate.domainName === domainNameArg;
        });
        if (certificateForDomain instanceof cert_classes_certificate_1.Certificate) {
            certificateForDomain.renew()
                .then(done.resolve);
        }
        else {
            certificateForDomain = new cert_classes_certificate_1.Certificate({
                certInstance: this,
                domainName: domainNameArg
            });
            certificateForDomain.renew()
                .then(done.resolve);
        }
        return done.promise;
    }
    /**
     * cleans up old certificates
     */
    cleanOldCertificates() {
    }
    /**
     * executes the current batch of jobs
     */
    deploy() {
    }
}
exports.Cert = Cert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9jZXJ0LmNsYXNzZXMuY2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQXNCO0FBQ3RCLDZCQUEwQztBQUsxQyxVQUFVO0FBQ1YseUVBQXdEO0FBRXhELHlFQUFnRTtBQUNoRSxtRkFBa0U7QUFXbEU7SUFPSTs7T0FFRztJQUNILFlBQVksVUFBbUM7UUFUL0MsMkJBQXNCLEdBQUcsSUFBSSxlQUFTLEVBQUUsQ0FBQTtRQUN4QyxtQkFBYyxHQUFHLElBQUksZUFBUyxFQUFlLENBQUE7UUFVekMsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGdEQUFnQixDQUFDO1lBQzFDLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTztZQUMzQixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7U0FDMUIsQ0FBQyxDQUFBO1FBRUYsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxzQ0FBVyxDQUFDO1lBQy9CLEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSztZQUN2QixNQUFNLEVBQUUsVUFBVSxDQUFDLFVBQVU7WUFDN0IsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtTQUMzQyxDQUFDLENBQUE7UUFFRixnQkFBZ0I7UUFDaEI7Ozs7YUFJSztJQUNULENBQUM7SUFFRDs7T0FFRztJQUNILGNBQWMsQ0FBQyxhQUFxQixFQUFFLGFBQWlDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUNuRixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDcEIsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVc7WUFDNUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEtBQUssYUFBYSxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLENBQUMsb0JBQW9CLFlBQVksc0NBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFO2lCQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzNCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLG9CQUFvQixHQUFHLElBQUksc0NBQVcsQ0FBQztnQkFDbkMsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLFVBQVUsRUFBRSxhQUFhO2FBQzVCLENBQUMsQ0FBQTtZQUNGLG9CQUFvQixDQUFDLEtBQUssRUFBRTtpQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsb0JBQW9CO0lBRXBCLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07SUFFTixDQUFDO0NBQ0o7QUFwRUQsb0JBb0VDIn0=