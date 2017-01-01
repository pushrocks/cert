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
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDirPath: path.join(process.cwd(), 'test/assets'),
                gitOriginRepo: 'git@gitlab.com:sandboxzone/sandbox-sslorigin.git',
                leEnv: 'staging'
            });
            should(testCert).be.instanceof(cert.Cert);
        });
        it('should run class Cert.setup() successful', function (done) {
            this.timeout(40000);
            testCert.setup().then(() => {
                done();
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUFxQjtBQUNyQixpQ0FBZ0M7QUFDaEMsK0JBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qix1QkFBdUI7QUFDdkIsc0NBQXFDO0FBR3JDLElBQUksUUFBUSxHQUFHLElBQUksV0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUE7QUFFakUsSUFBSSxRQUFtQixDQUFBO0FBRXZCLFFBQVEsQ0FBQyxNQUFNLEVBQUM7SUFDWixRQUFRLENBQUMsTUFBTSxFQUFDO1FBQ1osRUFBRSxDQUFDLDRDQUE0QyxFQUFDO1lBQzVDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7Z0JBQzdCLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU07Z0JBQ3pCLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBQyxhQUFhLENBQUM7Z0JBQ2xELGFBQWEsRUFBRSxrREFBa0Q7Z0JBQ2pFLEtBQUssRUFBRSxTQUFTO2FBQ25CLENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM3QyxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxVQUFTLElBQUk7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNuQixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNsQixJQUFJLEVBQUUsQ0FBQTtZQUNWLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsZ0NBQWdDLEVBQUMsVUFBUyxJQUFJO1lBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDckIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFBO1lBQ3JCLDRCQUE0QixHQUFHLEVBQUUsR0FBRztnQkFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1lBQ3hELENBQUM7WUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxrQkFBa0IsQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7WUFDNUYsK0ZBQStGO1lBQy9GLCtGQUErRjtZQUMvRixDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDckIsSUFBSSxFQUFFLENBQUE7WUFDVixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSJ9