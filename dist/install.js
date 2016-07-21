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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2luc3RhbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQVksT0FBTyxXQUFNLGdCQUFnQixDQUFDLENBQUE7QUFDMUMsTUFBWSxLQUFLLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFFM0Isb0JBQVksR0FBRztJQUN0QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFFL0QsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUN6QixrRkFBa0YsRUFDbEYsS0FBSyxDQUFDLGFBQWEsQ0FDdEIsQ0FBQyxJQUFJLENBQUM7UUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN4QixDQUFDLENBQUM7QUFFRixJQUFJLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDL0MsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUNoQixXQUFXLEVBQUMsU0FBUztDQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFZLENBQUMsQ0FBQztBQUN0QixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMifQ==