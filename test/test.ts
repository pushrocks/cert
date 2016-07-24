import "typings-test";
import "should";
import {Qenv} from "qenv";
import path = require("path");
import q = require("q");
import {startInstall} from "../dist/install";
import * as cert from "../dist/index";


let testQenv = new Qenv(process.cwd(), process.cwd() + "/.nogit");

let testCert:cert.Cert;

describe("cert",function(){
    describe("install",function(){
        it("should download letsencrypt.sh",function(done){
            this.timeout(5000);
            startInstall().then(() => {
                done();
            })
        })
    })
    describe("Cert",function(){
        it("should create a new Cert object from class",function(){
            this.timeout(40000);
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDir: path.join(process.cwd(),"test/assets"),
                gitOriginRepo:"git@gitlab.com:sandboxzone/sandbox-sslorigin.git",
                testMode:true
            });
            testCert.should.be.instanceof(cert.Cert);
        })
        it("should get a valid certificate",function(done){
            this.timeout(1200000);
            let promiseArray = [];
            function getRandomArbitrary(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
            promiseArray.push(testCert.getDomainCert(`testing${getRandomArbitrary(1,100000)}.bleu.de`));
            promiseArray.push(testCert.getDomainCert(`testing${getRandomArbitrary(1,100000)}.bleu.de`));
            promiseArray.push(testCert.getDomainCert(`testing${getRandomArbitrary(1,100000)}.bleu.de`));
            q.all(promiseArray).then(() => {
                done();
            });
        })
    })
});