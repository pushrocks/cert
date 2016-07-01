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
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDir: path.join(process.cwd(), "test/assets")
            });
            testCert.should.be.instanceof(cert.Cert);
        });
        it("should get a valid certificate", function (done) {
            this.timeout(120000);
            testCert.getDomainCert("sub10.bleu.de").then(function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUFRLENBQUMsQ0FBQTtBQUNoQixxQkFBbUIsTUFBTSxDQUFDLENBQUE7QUFDMUIsSUFBTyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFFOUIsd0JBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsSUFBWSxJQUFJLFdBQU0sZUFBZSxDQUFDLENBQUE7QUFHdEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxXQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUVsRSxJQUFJLFFBQWtCLENBQUM7QUFFdkIsUUFBUSxDQUFDLE1BQU0sRUFBQztJQUNaLFFBQVEsQ0FBQyxTQUFTLEVBQUM7UUFDZixFQUFFLENBQUMsZ0NBQWdDLEVBQUMsVUFBUyxJQUFJO1lBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsc0JBQVksRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDaEIsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixRQUFRLENBQUMsTUFBTSxFQUFDO1FBQ1osRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1lBQzVDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7Z0JBQzdCLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU07Z0JBQ3pCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBQyxhQUFhLENBQUM7YUFDakQsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBQyxVQUFTLElBQUk7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQixRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDekMsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQyJ9