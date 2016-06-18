# Cert
Easily obain SSL certificates from LetsEncrypt. Supports DNS-01 challenge. TypeScript ready.

## Usage 

```typescript
import {Cert} from "cert";

myCert = new Cert({
    cfEmail = "some@cloudflare.email",
    cfKey = "someCloudflareApiKey",
    outputPath = "someOutputPath" // NOTE: if you already have certificates, make sure you put them in here, so cert only requires the missing ones
});

myCert.getDomainCert("example.com");
```