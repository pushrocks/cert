# Cert
Easily obain SSL certificates from LetsEncrypt. Supports DNS-01 challenge. TypeScript ready.

## Availabililty
[![npm](https://push.rocks/assets/repo-button-npm.svg)](https://www.npmjs.com/package/cert)
[![git](https://push.rocks/assets/repo-button-git.svg)](https://gitlab.com/pushrocks/cert)
[![git](https://push.rocks/assets/repo-button-mirror.svg)](https://github.com/pushrocks/cert)
[![docs](https://push.rocks/assets/repo-button-docs.svg)](https://pushrocks.gitlab.io/cert/)

## Status for master
[![build status](https://gitlab.com/pushrocks/cert/badges/master/build.svg)](https://gitlab.com/pushrocks/cert/commits/master)
[![coverage report](https://gitlab.com/pushrocks/cert/badges/master/coverage.svg)](https://gitlab.com/pushrocks/cert/commits/master)
[![Dependency Status](https://david-dm.org/pushrocks/cert.svg)](https://david-dm.org/pushrocks/cert)
[![bitHound Dependencies](https://www.bithound.io/github/pushrocks/cert/badges/dependencies.svg)](https://www.bithound.io/github/pushrocks/cert/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/pushrocks/cert/badges/code.svg)](https://www.bithound.io/github/pushrocks/cert)
[![TypeScript](https://img.shields.io/badge/TypeScript-2.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![node](https://img.shields.io/badge/node->=%206.x.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Usage 

```typescript
import {Cert} from "cert";

let myCert = new Cert({
    cfEmail: "some@cloudflare.email",
    cfKey: "someCloudflareApiKey",
    sslDir: "someOutputPath", // NOTE: if you already have certificates, make sure you put them in here, so cert only requires the missing ones
    gitOriginRepo: "git@githhub.com/someuser/somereopo" // good for persistence in highly volatile environments like docker
});

myCert.getDomainCert("example.com"); // returns promise
```

> **Note:** cert supports async parallel cert fetching.
However any subsequent calls will wait for the queue of the same dns zone to clear.
In other words: test1.domain1.tld and test2.domain2.tld will run in parallel, but test2.domain1.tld will wait for test1.domain1.tld !

## sslDir
to use the certificates it is important to understand what the structure of the ssl directory looks like.

## using a git origin repo.
Often times you want to keep track of certificates in order to keep them
even if the point of initial certificate request is gone. Imagine you have a dockerenvironement
and you keep starting new container versions for the same domain. YOu ideally want to use a proxy
that handles SSL managemet for you. But even the proxy needs to be updated from time to time.

So you need some kind of persistence between versions. This is why you can sync up all certificates to a git repo over ssh
Just make sure your id_rsa is in place for the node user and is allowed for the origin repo.

[![npm](https://push.rocks/assets/repo-header.svg)](https://push.rocks)
