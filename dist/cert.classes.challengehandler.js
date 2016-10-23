"use strict";
const plugins = require("./cert.plugins");
/**
 * class ChallengeHandler handles challenges
 */
class ChallengeHandler {
    constructor(optionsArg) {
        this._cfInstance = new plugins.cflare.CflareAccount();
        this._cfInstance.auth({
            email: optionsArg.cfEmail,
            key: optionsArg.cfKey
        });
    }
    /**
     * set a challenge
     */
    setChallenge(domainNameArg, challengeArg) {
        let done = plugins.q.defer();
        plugins.beautylog.log('setting challenge for ' + domainNameArg);
        this._cfInstance.createRecord(prefixName(domainNameArg), 'TXT', challengeArg).then(() => {
            plugins.beautylog.ok('Challenge has been set!');
            plugins.beautylog.info('We need to cool down to let DNS propagate to edge locations!');
            cooldown().then(() => {
                done.resolve();
            });
        });
        return done.promise;
    }
    /**
     * cleans a challenge
     */
    cleanChallenge(domainNameArg) {
        let done = plugins.q.defer();
        plugins.beautylog.log('cleaning challenge for ' + domainNameArg);
        this._cfInstance.removeRecord(prefixName(domainNameArg), 'TXT');
        cooldown().then(() => {
            done.resolve();
        });
        return done.promise;
    }
}
exports.ChallengeHandler = ChallengeHandler;
/**
 * cooldown timer for letting DNS settle before answering the challengerequest
 */
let cooldown = () => {
    let done = plugins.q.defer();
    let cooldowntime = 60000;
    let passedTime = 0;
    plugins.beautylog.log('Cooling down! ' + (cooldowntime / 1000).toString() + ' seconds left');
    let coolDownCounter = () => {
        setTimeout(() => {
            if (cooldowntime <= passedTime) {
                plugins.beautylog.ok('Cooled down!');
                done.resolve();
            }
            else {
                passedTime = passedTime + 5000;
                plugins.beautylog.log('Cooling down! '
                    + ((cooldowntime - passedTime) / 1000).toString()
                    + ' seconds left');
                coolDownCounter();
            }
        }, 5000);
    };
    coolDownCounter();
    return done.promise;
};
/**
 * prefix a domain name to make sure it complies with letsencrypt
 */
let prefixName = (domainNameArg) => {
    return '_acme-challenge.' + domainNameArg;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5jbGFzc2VzLmNoYWxsZW5nZWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9jZXJ0LmNsYXNzZXMuY2hhbGxlbmdlaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQXlDO0FBUXpDOztHQUVHO0FBQ0g7SUFFSSxZQUFZLFVBQStDO1FBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ2xCLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTztZQUN6QixHQUFHLEVBQUUsVUFBVSxDQUFDLEtBQUs7U0FDeEIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0gsWUFBWSxDQUFDLGFBQXFCLEVBQUUsWUFBb0I7UUFDcEQsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxhQUFhLENBQUMsQ0FBQTtRQUMvRCxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMvRSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUE7WUFDdEYsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNaLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUNsQixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsY0FBYyxDQUFDLGFBQWE7UUFDeEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsR0FBRyxhQUFhLENBQUMsQ0FBQTtRQUNoRSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDL0QsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ1osSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdkIsQ0FBQztDQUNKO0FBdENELDRDQXNDQztBQUVEOztHQUVHO0FBQ0gsSUFBSSxRQUFRLEdBQUc7SUFDWCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQzVCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQTtJQUN4QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUE7SUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUE7SUFDNUYsSUFBSSxlQUFlLEdBQUc7UUFDbEIsVUFBVSxDQUFDO1lBQ1AsRUFBRSxDQUFDLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFBO2dCQUNwQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDbEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFVBQVUsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFBO2dCQUM5QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0I7c0JBQ2hDLENBQUMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO3NCQUMvQyxlQUFlLENBQ3BCLENBQUE7Z0JBQ0QsZUFBZSxFQUFFLENBQUE7WUFDckIsQ0FBQztRQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNaLENBQUMsQ0FBQTtJQUNELGVBQWUsRUFBRSxDQUFBO0lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0FBQ3ZCLENBQUMsQ0FBQTtBQUVEOztHQUVHO0FBQ0gsSUFBSSxVQUFVLEdBQUcsQ0FBQyxhQUFxQjtJQUNuQyxNQUFNLENBQUMsa0JBQWtCLEdBQUcsYUFBYSxDQUFBO0FBQzdDLENBQUMsQ0FBQSJ9