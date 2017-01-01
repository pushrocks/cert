import 'typings-test'
import * as should from 'should'
import {Qenv} from 'qenv'
import path = require('path')
import q = require('q')
import * as cert from '../dist/index'


let testQenv = new Qenv(process.cwd(), process.cwd() + '/.nogit')

let testCert: cert.Cert

describe('cert',function(){
    describe('Cert',function(){
        it('should create a new Cert object from class',function(){
            testCert = new cert.Cert({
                cfEmail: process.env.CF_EMAIL,
                cfKey: process.env.CF_KEY,
                sslDirPath: path.join(process.cwd(),'test/assets'),
                gitOriginRepo: 'git@gitlab.com:sandboxzone/sandbox-sslorigin.git',
                leEnv: 'staging'
            })
            should(testCert).be.instanceof(cert.Cert)
        })
        it('should run class Cert.setup() successful', function(done){
            this.timeout(40000)
            testCert.setup().then(() => {
                done()
            })
        })
        it('should get a valid certificate',function(done){
            this.timeout(1200000)
            let promiseArray = []
            function getRandomArbitrary(min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            }
            promiseArray.push(testCert.addCertificate(`testing${getRandomArbitrary(1,100000)}.bleu.de`))
            // promiseArray.push(testCert.addCertificate(`testing${getRandomArbitrary(1,100000)}.bleu.de`))
            // promiseArray.push(testCert.addCertificate(`testing${getRandomArbitrary(1,100000)}.bleu.de`))
            q.all(promiseArray).then(() => {
                done()
            })
        })
    })
})