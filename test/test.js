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
            this.timeout(1200000);
            let promiseArray = [];
            function getRandomArbitrary(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
            promiseArray.push(testCert.getDomainCert(`testing${getRandomArbitrary(1, 100000)}.bleu.de`));
            promiseArray.push(testCert.getDomainCert(`testing${getRandomArbitrary(1, 100000)}.bleu.de`));
            promiseArray.push(testCert.getDomainCert(`testing${getRandomArbitrary(1, 100000)}.bleu.de`));
            q.all(promiseArray).then(() => {
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFzQjtBQUN0QixrQkFBZ0I7QUFDaEIsK0JBQTBCO0FBQzFCLDZCQUE4QjtBQUM5Qix1QkFBd0I7QUFDeEIsNkNBQTZDO0FBQzdDLHNDQUFzQztBQUd0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLFdBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBRWxFLElBQUksUUFBa0IsQ0FBQztBQUV2QixRQUFRLENBQUMsTUFBTSxFQUFDO0lBQ1osUUFBUSxDQUFDLFNBQVMsRUFBQztRQUNmLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBQyxVQUFTLElBQUk7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixzQkFBWSxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLFFBQVEsQ0FBQyxNQUFNLEVBQUM7UUFDWixFQUFFLENBQUMsNENBQTRDLEVBQUM7WUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNyQixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRO2dCQUM3QixLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNO2dCQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUMsYUFBYSxDQUFDO2dCQUM5QyxhQUFhLEVBQUMsa0RBQWtEO2dCQUNoRSxRQUFRLEVBQUMsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDSCxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLGdDQUFnQyxFQUFDLFVBQVMsSUFBSTtZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN0Qiw0QkFBNEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsa0JBQWtCLENBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVGLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLGtCQUFrQixDQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM1RixZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxrQkFBa0IsQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDNUYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUMifQ==