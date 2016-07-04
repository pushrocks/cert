"use strict";
require("typings-test");
require("should");
var qenv_1 = require("qenv");
var path = require("path");
var install_1 = require("../dist/install");
var cert = require("../dist/index");
var testQenv = new qenv_1.Qenv(process.cwd(), process.cwd() + "/.nogit");
var testCert;
describe("cert", function () {
    describe("install", function () {
        it("should download letsencrypt.sh", function (done) {
            this.timeout(5000);
            install_1.startInstall().then(function () {
                done();
            });
        });
    });
    describe("Cert", function () {
        it("should create a new Cert object from class", function () {
            this.timeout(20000);
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDir: path.join(process.cwd(), "test/assets"),
                gitOriginRepo: "git@gitlab.com:philkunz/sandbox-sslorigin.git"
            });
            testCert.should.be.instanceof(cert.Cert);
        });
        it("should get a valid certificate", function (done) {
            this.timeout(120000);
            testCert.getDomainCert("sub11.bleu.de").then(function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUFRLENBQUMsQ0FBQTtBQUNoQixxQkFBbUIsTUFBTSxDQUFDLENBQUE7QUFDMUIsSUFBTyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFFOUIsd0JBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsSUFBWSxJQUFJLFdBQU0sZUFBZSxDQUFDLENBQUE7QUFHdEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxXQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUVsRSxJQUFJLFFBQWtCLENBQUM7QUFFdkIsUUFBUSxDQUFDLE1BQU0sRUFBQztJQUNaLFFBQVEsQ0FBQyxTQUFTLEVBQUM7UUFDZixFQUFFLENBQUMsZ0NBQWdDLEVBQUMsVUFBUyxJQUFJO1lBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsc0JBQVksRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDaEIsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixRQUFRLENBQUMsTUFBTSxFQUFDO1FBQ1osRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDckIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtnQkFDN0IsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFDLGFBQWEsQ0FBQztnQkFDOUMsYUFBYSxFQUFDLCtDQUErQzthQUNoRSxDQUFDLENBQUM7WUFDSCxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLGdDQUFnQyxFQUFDLFVBQVMsSUFBSTtZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JCLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN6QyxJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQyxDQUFDIn0=