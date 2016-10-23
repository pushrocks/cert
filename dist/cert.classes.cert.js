"use strict";
const q = require("q");
const lik_1 = require("lik");
// classes
const cert_classes_certificate_1 = require("./cert.classes.certificate");
const cert_classes_certrepo_1 = require("./cert.classes.certrepo");
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
        this._certRepo = new cert_classes_certrepo_1.CertRepo({
            sslDirPath: optionsArg.sslDirPath,
            gitOriginRepo: optionsArg.gitOriginRepo,
            certInstance: this
        });
        this._certRepo;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9jZXJ0LmNsYXNzZXMuY2VydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQXNCO0FBQ3RCLDZCQUEwQztBQUsxQyxVQUFVO0FBQ1YseUVBQXdEO0FBQ3hELG1FQUFrRDtBQUNsRCx5RUFBZ0U7QUFDaEUsbUZBQWtFO0FBV2xFO0lBT0k7O09BRUc7SUFDSCxZQUFZLFVBQW1DO1FBVC9DLDJCQUFzQixHQUFHLElBQUksZUFBUyxFQUFFLENBQUE7UUFDeEMsbUJBQWMsR0FBRyxJQUFJLGVBQVMsRUFBZSxDQUFBO1FBVXpDLDBCQUEwQjtRQUMxQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxnREFBZ0IsQ0FBQztZQUMxQyxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87WUFDM0IsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLO1NBQzFCLENBQUMsQ0FBQTtRQUVGLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksc0NBQVcsQ0FBQztZQUMvQixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7WUFDdkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxVQUFVO1lBQzdCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7U0FDM0MsQ0FBQyxDQUFBO1FBRUYsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxnQ0FBUSxDQUFDO1lBQzFCLFVBQVUsRUFBRSxVQUFVLENBQUMsVUFBVTtZQUNqQyxhQUFhLEVBQUUsVUFBVSxDQUFDLGFBQWE7WUFDdkMsWUFBWSxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxjQUFjLENBQUMsYUFBcUIsRUFBRSxhQUFpQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7UUFDbkYsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3BCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXO1lBQzVELE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxLQUFLLGFBQWEsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixZQUFZLHNDQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzlDLG9CQUFvQixDQUFDLEtBQUssRUFBRTtpQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMzQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixvQkFBb0IsR0FBRyxJQUFJLHNDQUFXLENBQUM7Z0JBQ25DLFlBQVksRUFBRSxJQUFJO2dCQUNsQixVQUFVLEVBQUUsYUFBYTthQUM1QixDQUFDLENBQUE7WUFDRixvQkFBb0IsQ0FBQyxLQUFLLEVBQUU7aUJBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDM0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNILG9CQUFvQjtJQUVwQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNO0lBRU4sQ0FBQztDQUNKO0FBdEVELG9CQXNFQyJ9