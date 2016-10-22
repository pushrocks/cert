"use strict";
const plugins = require("./cert.plugins");
const paths = require("./cert.paths");
exports.startInstall = () => {
    let done = plugins.q.defer();
    plugins.beautylog.info("installing letsencrypt.sh locally...");
    plugins.fs.ensureDir(plugins.path.join(__dirname, "assets/"));
    plugins.smartfile.remote.toFs("https://raw.githubusercontent.com/lukas2511/letsencrypt.sh/master/letsencrypt.sh", paths.letsencryptSh).then(() => {
        plugins.beautylog.success("Done!");
        done.resolve();
    });
    return done.promise;
};
let smartcli = new plugins.smartcli.Smartcli();
smartcli.addCommand({
    commandName: "install"
}).then(exports.startInstall);
smartcli.startParse();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2luc3RhbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFFM0IsUUFBQSxZQUFZLEdBQUc7SUFDdEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM3QixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBRS9ELE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDekIsa0ZBQWtGLEVBQ2xGLEtBQUssQ0FBQyxhQUFhLENBQ3RCLENBQUMsSUFBSSxDQUFDO1FBQ0gsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBRUYsSUFBSSxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQy9DLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDaEIsV0FBVyxFQUFDLFNBQVM7Q0FDeEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBWSxDQUFDLENBQUM7QUFDdEIsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDIn0=