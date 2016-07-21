# Cert
Easily obain SSL certificates from LetsEncrypt. Supports DNS-01 challenge. TypeScript ready.

## Status
[![build status](https://gitlab.com/pushrocks/cert/badges/master/build.svg)](https://gitlab.com/pushrocks/cert/commits/master)

## Usage 

```typescript
import {Cert} from "cert";

let myCert = new Cert({
    cfEmail: "some@cloudflare.email",
    cfKey: "someCloudflareApiKey",
    sslDir: "someOutputPath", // NOTE: if you already have certificates, make sure you put them in here, so cert only requires the missing ones
    gitOriginRepo: "git@githhub.com/someuser/somereopo" // good for persistence in highly volatile environments like docker
});

myCert.getDomainCert("example.com");
```

## sslDir
to use the certificates it is important to understand what the structure of the ssl directory looks like.

## using a git origin repo.
Often times you want to keep track of certificates in order to keep them
even if the point of initial certificate request is gone. Imagine you have a dockerenvironement
and you keep starting new container versions for the same domain. YOu ideally want to use a proxy
that handles SSL managemet for you. But even the proxy needs to be updated from time to time.

So you need some kind of persistence between versions. This is why you can sync up all certificates to a git repo over ssh
Just make sure your id_rsa is in place for the node user and is allowed for the origin repo.

## Environment
Since cert relies on [letsencrypt.sh](https://github.com/lukas2511/letsencrypt.sh) in the background bash is needed on the system.
If you plan on using this on Windows check out [npmdocker](https://www.npmjs.com/package/npmdocker) which runs node programs in docker.
As of summer 2016 Windows will also ship with bash nativly included.