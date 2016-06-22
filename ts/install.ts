import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

export let startInstall = () => {
    let done = plugins.q.defer();
    plugins.beautylog.info("installing letsencrypt.sh locally...");

    plugins.fs.ensureDir(plugins.path.join(__dirname, "assets/"));
    plugins.smartfile.remote.toFs(
        "https://raw.githubusercontent.com/lukas2511/letsencrypt.sh/master/letsencrypt.sh",
        paths.letsencryptSh
    ).then(() => {
        plugins.beautylog.success("Done!");
        done.resolve();
    });
    return done.promise;
};

let smartcli = new plugins.smartcli.Smartcli();
smartcli.addCommand({
    commandName:"install"
}).then(startInstall);
smartcli.startParse();