import "typings-test";
import "should";
import {Qenv} from "qenv";

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
        it("should create a new cert",function(){
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDir: ""
            });
            testCert.should.be.instanceof(cert.Cert);
        })
        it("should get a valid certificate",function(done){
            this.timeout(120000);
            testCert.getDomainCert("sub3.bleu.de").then(() => {
                done();
            });
        })
    })
});