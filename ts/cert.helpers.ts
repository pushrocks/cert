import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

let firstCall = true;
let accountKeyPresent = true;
export let accountsKeyPresent = () => {
    let done = plugins.q.defer();
    if (firstCall) {
        done.resolve();
        firstCall = false;
        setTimeout(() => {accountKeyPresent = true},5000);
    } else if(accountKeyPresent){
        done.resolve()
    } else {
        setTimeout(done.resolve, 5000);
    };
    return done.promise;
};