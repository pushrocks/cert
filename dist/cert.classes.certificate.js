"use strict";
const q = require("q");
const plugins = require("./cert.plugins");
class Certificate {
    /**
     * run when creating a new instance of Certificate
     */
    constructor(optionsArg) {
        this.creationDate = null;
        this.expiryDate = null;
        this.publicKey = null;
        this.privKey = null;
        this.domainName = optionsArg.domainName;
        this.domainData = new plugins.smartstring.Domain(this.domainName);
        this.certInstance = optionsArg.certInstance;
    }
    /**
     * the status of the Certificate
     */
    get status() {
        let validTimeRemaining = 0;
        if (this.creationDate !== null && this.expiryDate !== null) {
            validTimeRemaining = this.expiryDate.getTime() - Date.now();
        }
        let MonthMilliseconds = 2629746000;
        if (this.publicKey === null || this.privKey === null) {
            return 'unregistered';
        }
        else if (validTimeRemaining >= MonthMilliseconds) {
            return 'valid';
        }
        else if (validTimeRemaining < MonthMilliseconds && validTimeRemaining >= 0) {
            return 'expiring';
        }
        else {
            return 'expired';
        }
    }
    get sameZoneRequesting() {
        return this.certInstance.domainStringRequestMap.checkMinimatch('*' + this.domainData.zoneName);
    }
    /**
     * schedule a retry of certificate request
     */
    scheduleRetry() {
        let done = plugins.q.defer();
        setTimeout(() => {
            this.renew()
                .then(done.resolve);
        }, 60000);
        return done.promise;
    }
    /**
     * renew certificate if needed
     */
    renew(force = false) {
        let done = q.defer();
        if (this.status === 'valid') {
            plugins.beautylog.log('Certificate still valid for more than 1 month, so it is not renewed now');
            done.resolve();
        }
        else if (this.status === 'expiring' || this.status === 'expired' || this.status === 'unregistered') {
            plugins.beautylog.info('Certificate not valid currently, going to renew now!');
            if (this.sameZoneRequesting) {
                this.certInstance.domainStringRequestMap.registerUntilTrue(() => {
                    return !this.sameZoneRequesting;
                }, () => {
                    this.renew().then(done.resolve);
                });
            }
            else {
                this.certInstance.letsencrypt.registerDomain(this.domainName)
                    .then(() => {
                    return this.syncFs();
                })
                    .then(() => {
                    done.resolve();
                }).catch((err) => { console.log(err); });
            }
        }
        else {
            throw Error(`weird status for certificate with domain name ${this.domainName}`);
        }
        done.resolve();
        return done.promise;
    }
    /**
     * syncFs syncs the certificate with disk
     */
    syncFs() {
        let configJsonMemory = {
            domainName: this.domainName,
            creationTime: this.creationDate.getTime(),
            expiryTime: this.expiryDate.getTime()
        };
    }
    /**
     * deletes the certificate
     */
    delete() { }
}
exports.Certificate = Certificate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNlcnRpZmljYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5jbGFzc2VzLmNlcnRpZmljYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBc0I7QUFFdEIsMENBQXlDO0FBcUJ6QztJQVNJOztPQUVHO0lBQ0gsWUFBWSxVQUEwQztRQVJ0RCxpQkFBWSxHQUFTLElBQUksQ0FBQTtRQUN6QixlQUFVLEdBQVMsSUFBSSxDQUFBO1FBQ3ZCLGNBQVMsR0FBVyxJQUFJLENBQUE7UUFDeEIsWUFBTyxHQUFXLElBQUksQ0FBQTtRQU1sQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUE7UUFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNqRSxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUE7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxNQUFNO1FBQ04sSUFBSSxrQkFBa0IsR0FBVyxDQUFDLENBQUE7UUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hELGtCQUFrQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2hFLENBQUM7UUFDRCxJQUFJLGlCQUFpQixHQUFHLFVBQVUsQ0FBQTtRQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLGNBQWMsQ0FBQTtRQUN6QixDQUFDO1FBQUMsSUFBSSxD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