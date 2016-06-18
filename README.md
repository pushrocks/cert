# Cert
Easily obain SSL certificates from LetsEncrypt. Supports DNS-01 challenge. TypeScript ready.

> Note: this package is in pre-alpha stage and will be ready soon.

## Usage 

```typescript
import {Cert} from "cert";

let myCert = new Cert({
    cfEmail: "some@cloudflare.email",
    cfKey: "someCloudflareApiKey",
    sslDir: "someOutputPath", // NOTE: if you already have certificates, make sure you put them in here, so cert only requires the missing ones
    gitOriginRepo: "git@githhub.com/someuser/somereopo" // good for pesistence in highly volatile environments like docker
});

myCert.getDomainCert("example.com");
```

### sslDir
to use the certificates it is important to understand what the structure of the ssl directory looks like.