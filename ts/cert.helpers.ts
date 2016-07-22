import {Cert} from "./index.ts";
import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

let firstCall = true;
let enoughTime = false;
export let accountsKeyPresent = () => {
    let done = plugins.q.defer();
    if (firstCall) {
        done.resolve();
        firstCall = false;
    }  else {
        setTimeout(done.resolve,5000);
    };
    return done.promise;
};

export let scheduleRetry = (domainArg:string,certClassArg:Cert) => {
    let done = plugins.q.defer();
    setTimeout(() => {
        certClassArg.getDomainCert(domainArg)
            .then(done.resolve);
    },5000);
    return done.promise;
};