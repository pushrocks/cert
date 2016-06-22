#!/usr/bin/env node
"use strict";
require("typings-global");
var plugins = require("./cert.plugins");
var paths = require("./cert.paths");
var smartcli = new plugins.smartcli.Smartcli();
var config = plugins.smartfile.local.toObjectSync(paths.config);
var cflare = new plugins.cflare.CflareAccount();
cflare.auth({
    email: config.cfEmail,
    key: config.cfKey
});
var setChallenge = function (domainNameArg, challengeArg) {
    var done = plugins.q.defer();
    cflare.createRecord(prefixName(domainNameArg), "TXT", challengeArg).then(function () {
        cooldown().then(function () {
            done.resolve();
        });
    });
    return done.promise;
};
var cleanChallenge = function (domainNameArg) {
    var done = plugins.q.defer();
    cflare.removeRecord(prefixName(domainNameArg), "TXT");
    return done.promise;
};
var cooldown = function () {
    var done = plugins.q.defer();
    console.log("Cooling down!");
    setTimeout(function () {
        done.resolve();
    }, 20000);
    return done.promise;
};
var prefixName = function (domainNameArg) {
    return "_acme-challenge." + domainNameArg;
};
smartcli.addCommand({
    commandName: "deploy_challenge"
}).then(function (argv) {
    setChallenge(argv._[1], argv._[3]);
});
smartcli.addCommand({
    commandName: "clean_challenge"
}).then(function (argv) {
    cleanChallenge(argv._[1]);
});
smartcli.startParse();

//# sourceMappingURL=data:application/json;charset=utf8;base64,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ZSBzaGViYW5nIGxpbmUgYWJvdmUgbWFrZXMgc3VyZSB0aGlzIHNjcmlwdCB3aWxsIGdldCBpbnRlcnByZXRlZCBieSBub2RlXG5cbmltcG9ydCBcInR5cGluZ3MtZ2xvYmFsXCI7XG5pbXBvcnQgKiBhcyBwbHVnaW5zIGZyb20gXCIuL2NlcnQucGx1Z2luc1wiO1xuaW1wb3J0ICogYXMgcGF0aHMgZnJvbSBcIi4vY2VydC5wYXRoc1wiO1xuXG5sZXQgc21hcnRjbGkgPSBuZXcgcGx1Z2lucy5zbWFydGNsaS5TbWFydGNsaSgpO1xuXG5sZXQgY29uZmlnID0gcGx1Z2lucy5zbWFydGZpbGUubG9jYWwudG9PYmplY3RTeW5jKHBhdGhzLmNvbmZpZyk7XG5sZXQgY2ZsYXJlID0gbmV3IHBsdWdpbnMuY2ZsYXJlLkNmbGFyZUFjY291bnQoKTtcbmNmbGFyZS5hdXRoKHtcbiAgICBlbWFpbDogY29uZmlnLmNmRW1haWwsXG4gICAga2V5OiBjb25maWcuY2ZLZXlcbn0pO1xuXG5sZXQgc2V0Q2hhbGxlbmdlID0gKGRvbWFpbk5hbWVBcmc6IHN0cmluZywgY2hhbGxlbmdlQXJnOiBzdHJpbmcpID0+IHtcbiAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgIGNmbGFyZS5jcmVhdGVSZWNvcmQocHJlZml4TmFtZShkb21haW5OYW1lQXJnKSwgXCJUWFRcIiwgY2hhbGxlbmdlQXJnKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29vbGRvd24oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGRvbmUucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xufVxuXG5sZXQgY2xlYW5DaGFsbGVuZ2UgPSAoZG9tYWluTmFtZUFyZykgPT4ge1xuICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgY2ZsYXJlLnJlbW92ZVJlY29yZChwcmVmaXhOYW1lKGRvbWFpbk5hbWVBcmcpLCBcIlRYVFwiKTtcbiAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xufVxuXG5sZXQgY29vbGRvd24gPSAoKSA9PiB7XG4gICAgbGV0IGRvbmUgPSBwbHVnaW5zLnEuZGVmZXIoKTtcbiAgICBjb25zb2xlLmxvZyhcIkNvb2xpbmcgZG93biFcIik7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRvbmUucmVzb2x2ZSgpO1xuICAgIH0sIDIwMDAwKVxuICAgIHJldHVybiBkb25lLnByb21pc2U7XG59XG5cbmxldCBwcmVmaXhOYW1lID0gKGRvbWFpbk5hbWVBcmc6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIFwiX2FjbWUtY2hhbGxlbmdlLlwiICsgZG9tYWluTmFtZUFyZztcbn1cblxuc21hcnRjbGkuYWRkQ29tbWFuZCh7XG4gICAgY29tbWFuZE5hbWU6IFwiZGVwbG95X2NoYWxsZW5nZVwiXG59KS50aGVuKChhcmd2KSA9PiB7XG4gICAgc2V0Q2hhbGxlbmdlKGFyZ3YuX1sxXSwgYXJndi5fWzNdKTtcbn0pO1xuXG5zbWFydGNsaS5hZGRDb21tYW5kKHtcbiAgICBjb21tYW5kTmFtZTogXCJjbGVhbl9jaGFsbGVuZ2VcIlxufSkudGhlbigoYXJndikgPT4ge1xuICAgIGNsZWFuQ2hhbGxlbmdlKGFyZ3YuX1sxXSk7XG59KTtcblxuc21hcnRjbGkuc3RhcnRQYXJzZSgpO1xuIl19
