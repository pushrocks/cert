"use strict";
const plugins = require("./cert.plugins");
let firstCall = true;
let enoughTime = false;
exports.accountsKeyPresent = () => {
    let done = plugins.q.defer();
    if (firstCall) {
        done.resolve();
        firstCall = false;
    }
    else {
        setTimeout(done.resolve, 5000);
    }
    ;
    return done.promise;
};
exports.scheduleRetry = (domainArg, certClassArg) => {
    let done = plugins.q.defer();
    setTimeout(() => {
        certClassArg.getDomainCert(domainArg)
            .then(done.resolve);
    }, 20000);
    return done.promise;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvY2VydC5oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxNQUFZLE9BQU8sV0FBTSxnQkFBZ0IsQ0FBQyxDQUFBO0FBRzFDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDWiwwQkFBa0IsR0FBRztJQUM1QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzdCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFBRSxJQUFJLENBQUMsQ0FBQztRQUNMLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFBQSxDQUFDO0lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRVMscUJBQWEsR0FBRyxDQUFDLFNBQWdCLEVBQUMsWUFBaUI7SUFDMUQsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM3QixVQUFVLENBQUM7UUFDUCxZQUFZLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQzthQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3hCLENBQUMsQ0FBQyJ9