"use strict";
require("typings-test");
const should = require("should");
const qenv_1 = require("qenv");
const path = require("path");
const q = require("q");
const cert = require("../dist/index");
let testQenv = new qenv_1.Qenv(process.cwd(), process.cwd() + '/.nogit');
let testCert;
describe('cert', function () {
    describe('Cert', function () {
        it('should create a new Cert object from class', function () {
            this.timeout(40000);
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDirPath: path.join(process.cwd(), 'test/assets'),
                gitOriginRepo: 'git@gitlab.com:sandboxzone/sandbox-sslorigin.git',
                leEnv: 'staging'
            });
            should(testCert).be.instanceof(cert.Cert);
        });
        it('should get a valid certificate', function (done) {
            this.timeout(1200000);
            let promiseArray = [];
            function getRandomArbitrary(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
            promiseArray.push(testCert.addCertificate(`testing${getRandomArbitrary(1, 100000)}.bleu.de`));
            // promiseArray.push(testCert.addCertificate(`testing${getRandomArbitrary(1,100000)}.bleu.de`))
            // promiseArray.push(testCert.addCertificate(`testing${getRandomArbitrary(1,100000)}.bleu.de`))
            q.all(promiseArray).then(() => {
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFxQjtBQUNyQixpQ0FBZ0M7QUFDaEMsK0JBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qix1QkFBdUI7QUFDdkIsc0NBQXFDO0FBR3JDLElBQUksUUFBUSxHQUFHLElBQUksV0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUE7QUFFakUsSUFBSSxRQUFtQixDQUFBO0FBRXZCLFFBQVEsQ0FBQyxNQUFNLEVBQUM7SUFDWixRQUFRLENBQUMsTUFBTSxFQUFDO1FBQ1osRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbkIsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDckIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtnQkFDN0IsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDekIsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFDLGFBQWEsQ0FBQztnQkFDbEQsYUFBYSxFQUFFLGtEQUFrRDtnQkFDakUsS0FBSyxFQUFFLFNBQVM7YUFDbkIsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdDLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLGdDQUFnQyxFQUFDLFVBQVMsSUFBSTtZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3JCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQTtZQUNyQiw0QkFBNEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtZQUN4RCxDQUFDO1lBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsa0JBQWtCLENBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1lBQzVGLCtGQUErRjtZQUMvRiwrRkFBK0Y7WUFDL0YsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxDQUFBO1lBQ1YsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEifQ==