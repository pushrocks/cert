#!/usr/bin/env node
// the shebang line above makes sure this script will get interpreted by node

import "typings-global";
import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

let smartcli = new plugins.smartcli.Smartcli();

let config = plugins.smartfile.local.toObjectSync(paths.config);
let cflare = new plugins.cflare.CflareAccount();
cflare.auth({
    email: config.cfEmail,
    key: config.cfKey
});

let setChallenge = (domainNameArg: string, challengeArg: string) => {
    let done = plugins.q.defer();
    cflare.createRecord(prefixName(domainNameArg), "TXT", challengeArg).then(() => {
        cooldown().then(() => {
            done.resolve();
        });
    });
    return done.promise;
}

let cleanChallenge = (domainNameArg) => {
    let done = plugins.q.defer();
    cflare.removeRecord(prefixName(domainNameArg), "TXT");
    return done.promise;
}

let cooldown = () => {
    let done = plugins.q.defer();
    console.log("Cooling down!");
    setTimeout(() => {
        done.resolve();
    }, 20000)
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
