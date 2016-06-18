import * as beautylog from "beautylog";
import * as path from "path";
import * as smartfile from "smartfile";
beautylog.info("installing letsencrypt.sh locally...");
smartfile.remote.toFs(
    "https://raw.githubusercontent.com/lukas2511/letsencrypt.sh/master/letsencrypt.sh",
    path.join(__dirname,"assets/","le.sh")
).then(() => {
    beautylog.success("Done!");
});