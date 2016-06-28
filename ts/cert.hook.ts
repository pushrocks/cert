#!/usr/bin/env node
// the shebang line above makes sure this script will get interpreted by node

import "typings-global";
import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

let smartcli = new plugins.smartcli.Smartcli();

let config = plugins.smartfile.fs.toObjectSync(paths.config);
let cflare = new plugins.cflare.CflareAccount();
cflare.auth({
    email: config.cfEmail,
    key: config.cfKey
});

let setChallenge = (domainNameArg: string, challengeArg: string) => {
    let done = plugins.q.defer();
    plugins.beautylog.log("setting challenge for " + domainNameArg);
    cflare.createRecord(prefixName(domainNameArg), "TXT", challengeArg).then(() => {
        plugins.beautylog.ok("Challenge has been set!");
        plugins.beautylog.info("We need to cool down to let DNS propagate to edge locations!");
        cooldown().then(() => {
            done.resolve();
        });
    });
    return done.promise;
}

let cleanChallenge = (domainNameArg) => {
    let done = plugins.q.defer();
    plugins.beautylog.log("cleaning challenge for " + domainNameArg);
    cflare.removeRecord(prefixName(domainNameArg), "TXT");
    return done.promise;
}

let cooldown = () => {
    let done = plugins.q.defer();
    let cooldowntime = 40000;
    let passedTime = 0;
    plugins.beautylog.log("Cooling down! " + (cooldowntime/1000).toString() + " seconds left");
    let coolDownCounter = () => {
        setTimeout(() => {
            if(cooldowntime <= passedTime){
                plugins.beautylog.ok("Cooled down!");
                done.resolve();
            } else {
                passedTime = passedTime + 5000;
                plugins.beautylog.log("Cooling down! " + ((cooldowntime - passedTime)/1000).toString() + " seconds left");
                coolDownCounter();
            }
        }, 5000);
    }
    coolDownCounter();
    return done.promise;
}

let prefixName = (domainNameArg: string): string => {
    return "_acme-challenge." + domainNameArg;
}

smartcli.addCommand({
    commandName: "deploy_challenge"
}).then((argv) => {
    setChallenge(argv._[1], argv._[3]);
});

smartcli.addCommand({
    commandName: "clean_challenge"
}).then((argv) => {
    cleanChallenge(argv._[1]);
});

smartcli.startParse();
