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
    console.log(argv);
    setChallenge(argv._[1], argv._[3]);
});
smartcli.addCommand({
    commandName: "clean_challenge"
}).then(function (argv) {
    cleanChallenge(argv._[1]);
});
smartcli.startParse();

//# sourceMappingURL=data:application/json;charset=utf8;base64,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cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLy8gdGhlIHNoZWJhbmcgbGluZSBhYm92ZSBtYWtlcyBzdXJlIHRoaXMgc2NyaXB0IHdpbGwgZ2V0IGludGVycHJldGVkIGJ5IG5vZGVcblxuaW1wb3J0IFwidHlwaW5ncy1nbG9iYWxcIjtcbmltcG9ydCAqIGFzIHBsdWdpbnMgZnJvbSBcIi4vY2VydC5wbHVnaW5zXCI7XG5pbXBvcnQgKiBhcyBwYXRocyBmcm9tIFwiLi9jZXJ0LnBhdGhzXCI7XG5cbmxldCBzbWFydGNsaSA9IG5ldyBwbHVnaW5zLnNtYXJ0Y2xpLlNtYXJ0Y2xpKCk7XG5cbmxldCBjb25maWcgPSBwbHVnaW5zLnNtYXJ0ZmlsZS5sb2NhbC50b09iamVjdFN5bmMocGF0aHMuY29uZmlnKTtcbmxldCBjZmxhcmUgPSBuZXcgcGx1Z2lucy5jZmxhcmUuQ2ZsYXJlQWNjb3VudCgpO1xuY2ZsYXJlLmF1dGgoe1xuICAgIGVtYWlsOiBjb25maWcuY2ZFbWFpbCxcbiAgICBrZXk6IGNvbmZpZy5jZktleVxufSk7XG5cbmxldCBzZXRDaGFsbGVuZ2UgPSAoZG9tYWluTmFtZUFyZzogc3RyaW5nLCBjaGFsbGVuZ2VBcmc6IHN0cmluZykgPT4ge1xuICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgY2ZsYXJlLmNyZWF0ZVJlY29yZChwcmVmaXhOYW1lKGRvbWFpbk5hbWVBcmcpLCBcIlRYVFwiLCBjaGFsbGVuZ2VBcmcpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb29sZG93bigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZG9uZS5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBkb25lLnByb21pc2U7XG59XG5cbmxldCBjbGVhbkNoYWxsZW5nZSA9IChkb21haW5OYW1lQXJnKSA9PiB7XG4gICAgbGV0IGRvbmUgPSBwbHVnaW5zLnEuZGVmZXIoKTtcbiAgICBjZmxhcmUucmVtb3ZlUmVjb3JkKHByZWZpeE5hbWUoZG9tYWluTmFtZUFyZyksIFwiVFhUXCIpO1xuICAgIHJldHVybiBkb25lLnByb21pc2U7XG59XG5cbmxldCBjb29sZG93biA9ICgpID0+IHtcbiAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgIGNvbnNvbGUubG9nKFwiQ29vbGluZyBkb3duIVwiKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZG9uZS5yZXNvbHZlKCk7XG4gICAgfSwgMjAwMDApXG4gICAgcmV0dXJuIGRvbmUucHJvbWlzZTtcbn1cblxubGV0IHByZWZpeE5hbWUgPSAoZG9tYWluTmFtZUFyZzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gXCJfYWNtZS1jaGFsbGVuZ2UuXCIgKyBkb21haW5OYW1lQXJnO1xufVxuXG5zbWFydGNsaS5hZGRDb21tYW5kKHtcbiAgICBjb21tYW5kTmFtZTogXCJkZXBsb3lfY2hhbGxlbmdlXCJcbn0pLnRoZW4oKGFyZ3YpID0+IHtcbiAgICBjb25zb2xlLmxvZyhhcmd2KVxuICAgIHNldENoYWxsZW5nZShhcmd2Ll9bMV0sIGFyZ3YuX1szXSk7XG59KTtcblxuc21hcnRjbGkuYWRkQ29tbWFuZCh7XG4gICAgY29tbWFuZE5hbWU6IFwiY2xlYW5fY2hhbGxlbmdlXCJcbn0pLnRoZW4oKGFyZ3YpID0+IHtcbiAgICBjbGVhbkNoYWxsZW5nZShhcmd2Ll9bMV0pO1xufSk7XG5cbnNtYXJ0Y2xpLnN0YXJ0UGFyc2UoKTtcbiJdfQ==
