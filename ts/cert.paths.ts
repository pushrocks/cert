import "typings-global";
import * as plugins from "./cert.plugins";

export let certHook = plugins.path.join(__dirname,"cert.hook.js");
export let config = plugins.path.join(__dirname,"assets/config.json");
export let letsencryptSh = plugins.path.join(__dirname,"assets/letsencrypt.sh");
export let certDir = plugins.path.join(__dirname,"/assets/certs");