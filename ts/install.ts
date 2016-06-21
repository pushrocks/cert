import * as beautylog from "beautylog";
import * as path from "path";
import * as smartfile from "smartfile";
let fs = require("fs-extra");
beautylog.info("installing letsencrypt.sh locally...");

fs.ensureDir(path.join(__dirname,"assets/"));
smartfile.remote.toFs(
    "https://raw.githubusercontent.com/lukas2511/letsencrypt.sh/master/letsencrypt.sh",
    path.join(__dirname,"assets/","le.sh")
).then(() => {
    beautylog.success("Done!");
});