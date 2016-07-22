import * as plugins from "./cert.plugins";

//dirs
export let certDir = plugins.path.join(__dirname,"assets/certs");
export let defaultSslDir = plugins.path.join(__dirname,"assets/defaultSslDir");
export let assetDir = plugins.path.join(__dirname,"assets/");
export let accountsDir = plugins.path.join(__dirname,"assets/accounts/");

// files
export let certHook = plugins.path.join(__dirname,"cert.hook.js");
export let config = plugins.path.join(__dirname,"assets/config.json");
export let leShConfig = plugins.path.join(__dirname,"assets/leshconfig.json");
export let letsencryptSh = plugins.path.join(__dirname,"assets/letsencrypt.sh");

