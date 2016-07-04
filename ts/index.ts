import * as plugins from "./cert.plugins";
import * as paths from "./cert.paths";

export class Cert {
    private _cfEmail: string;
    private _cfKey: string;
    private _sslDir: string;
    certificatesPresent:Certificate[];
    certificatesValid:Certificate[];
    private _gitOriginRepo;
    constructor(optionsArg: {
        cfEmail: string,
        cfKey: string,
        sslDir: string,
        gitOriginRepo?: string
    }) {
        this._cfEmail = optionsArg.cfEmail;
        this._cfKey = optionsArg.cfKey;
        this._sslDir = optionsArg.sslDir;
        this._gitOriginRepo = optionsArg.gitOriginRepo;
        let config = {
            cfEmail: this._cfEmail,
            cfKey: this._cfKey
        }
        plugins.smartfile.memory.toFsSync(JSON.stringify(config),plugins.path.join(__dirname, "assets/config.json"));
        if(this._gitOriginRepo){
            plugins.smartgit.init(this._sslDir);
            plugins.smartgit.remote.add(this._sslDir,"origin",this._gitOriginRepo);
            this.sslGitOriginPull();
        }
    };
    sslGitOriginPull = () => {
        if(this._gitOriginRepo){
            plugins.smartgit.pull(this._sslDir,"origin","master");
        }
    };
    sslGitOriginAddCommitPush = () => {
        if(this._gitOriginRepo){
            plugins.smartgit.add.addAll(this._sslDir);
            plugins.smartgit.commit(this._sslDir,"added new SSL certificates and deleted obsolete ones.");
            plugins.smartgit.push(this._sslDir,"origin","master");
        }
    };
    getDomainCert(domainNameArg: string,optionsArg?:{force:boolean}) {
        let done = plugins.q.defer();
        this.sslGitOriginPull();
        if (!checkDomainsStillValid(domainNameArg) || optionsArg.force) {
            plugins.shelljs.exec("chmod 700 " + paths.letsencryptSh);
            plugins.shelljs.exec("chmod 700 " + paths.certHook);
            plugins.shelljs.exec("bash -c \"" + paths.letsencryptSh + " -c -d " + domainNameArg + " -t dns-01 -k " + paths.certHook + " -o " + paths.certDir + "\"");
            let fetchedCertsArray:string[] = plugins.smartfile.fs.listFoldersSync(paths.certDir);
            if(fetchedCertsArray.indexOf(domainNameArg) != -1){
                updateSslDirSync(this._sslDir,domainNameArg);
            }
            this.sslGitOriginAddCommitPush();
            done.resolve();
        } else {
            plugins.beautylog.info("certificate for " + domainNameArg + " is still valid! Not fetching new one!");
            done.resolve();
        };
        return done.promise;
    };
}

export class Certificate {
    domainName: string;
    creationDate: Date;
    expiryDate: Date;
    constructor() {

    };
}

interface certConfig {
    domainName:string;
    created:number;
    expires:number;
}

let checkDomainsStillValid = (domainNameArg: string): boolean => {
    return false;
}

let updateSslDirSync = (sslDirArg:string,domainNameArg:string) => {
    plugins.smartfile.fs.ensureDirSync(sslDirArg);
    let domainCertFolder = plugins.path.join(paths.certDir,domainNameArg)
    if(plugins.smartfile.fs.listFoldersSync(paths.certDir).indexOf(domainNameArg) != -1) {
        plugins.smartfile.fs.copySync(
            plugins.path.join(domainCertFolder,"fullchain.pem"),
            plugins.path.join(sslDirArg,domainNameArg,"fullchain.pem")
        );
        plugins.smartfile.fs.copySync(
            plugins.path.join(domainCertFolder,"privkey.pem"),
            plugins.path.join(sslDirArg,domainNameArg,"privkey.pem")
        );
        // create cert config
        let certRegex = /.*\-([0-9]*)\.pem/;
        let certFileNameWithTime:string = plugins.smartfile.fs.listFilesSync(domainCertFolder,certRegex)[0];
        let certTime = parseInt(certRegex.exec(certFileNameWithTime)[1]);
        let certConfig:certConfig = {
            domainName: domainNameArg,
            created: certTime,
            expires: certTime + 7776000
        };
        plugins.smartfile.memory.toFs(
            JSON.stringify(certConfig),
            plugins.path.join(sslDirArg,domainNameArg,"config.json")
        );
    };
}

const enum gitSyncDirection {
    toOrigin,
    fromOrigin
}

let updateGitOrigin = (syncDirectionArg:gitSyncDirection) => {

};

updateGitOrigin(gitSyncDirection.toOrigin);