"use strict";
const plugins = require("./cert.plugins");
// dirs
exports.projectDir = plugins.path.join(__dirname, '../');
exports.assetDir = plugins.path.join(exports.projectDir, 'assets');
exports.defaultSslDir = plugins.path.join(exports.assetDir, 'defaultSslDir');
exports.leConfigDir = plugins.path.join(exports.assetDir, 'letsencrypt');
plugins.smartfile.fs.ensureDirSync(exports.leConfigDir);
plugins.smartfile.fs.ensureDirSync(exports.defaultSslDir);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydC5wYXRocy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2NlcnQucGF0aHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUF5QztBQUV6QyxPQUFPO0FBQ0ksUUFBQSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9DLFFBQUEsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFVLEVBQUMsUUFBUSxDQUFDLENBQUE7QUFDakQsUUFBQSxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQVEsRUFBQyxlQUFlLENBQUMsQ0FBQTtBQUMzRCxRQUFBLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBUSxFQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2xFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxtQkFBVyxDQUFDLENBQUE7QUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFhLENBQUMsQ0FBQSJ9