"use strict";
require("typings-test");
require("should");
const qenv_1 = require("qenv");
const path = require("path");
const q = require("q");
const install_1 = require("../dist/install");
const cert = require("../dist/index");
let testQenv = new qenv_1.Qenv(process.cwd(), process.cwd() + "/.nogit");
let testCert;
describe("cert", function () {
    describe("install", function () {
        it("should download letsencrypt.sh", function (done) {
            this.timeout(5000);
            install_1.startInstall().then(() => {
                done();
            });
        });
    });
    describe("Cert", function () {
        it("should create a new Cert object from class", function () {
            this.timeout(40000);
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDir: path.join(process.cwd(), "test/assets"),
                gitOriginRepo: "git@gitlab.com:sandboxzone/sandbox-sslorigin.git",
                testMode: true
            });
            testCert.should.be.instanceof(cert.Cert);
        });
        it("should get a valid certificate", function (done) {
            this.timeout(120000);
            let promiseArray = [];
            promiseArray.push(testCert.getDomainCert("testing1.bleu.de"));
            promiseArray.push(testCert.getDomainCert("testing2.bleu.de"));
            promiseArray.push(testCert.getDomainCert("testing3.bleu.de"));
            q.all(promiseArray).then(() => {
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUFRLENBQUMsQ0FBQTtBQUNoQix1QkFBbUIsTUFBTSxDQUFDLENBQUE7QUFDMUIsTUFBTyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFDOUIsTUFBTyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDeEIsMEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsTUFBWSxJQUFJLFdBQU0sZUFBZSxDQUFDLENBQUE7QUFHdEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxXQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUVsRSxJQUFJLFFBQWtCLENBQUM7QUFFdkIsUUFBUSxDQUFDLE1BQU0sRUFBQztJQUNaLFFBQVEsQ0FBQyxTQUFTLEVBQUM7UUFDZixFQUFFLENBQUMsZ0NBQWdDLEVBQUMsVUFBUyxJQUFJO1lBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsc0JBQVksRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDaEIsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixRQUFRLENBQUMsTUFBTSxFQUFDO1FBQ1osRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDckIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtnQkFDN0IsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFDLGFBQWEsQ0FBQztnQkFDOUMsYUFBYSxFQUFDLGtEQUFrRDtnQkFDaEUsUUFBUSxFQUFDLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBQyxVQUFTLElBQUk7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdEIsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUM5RCxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzlELFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUMifQ==