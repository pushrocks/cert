import * as plugins from './cert.plugins'

// dirs
export let projectDir = plugins.path.join(__dirname,'../')
export let assetDir = plugins.path.join(projectDir,'assets')
export let defaultSslDir = plugins.path.join(assetDir,'defaultSslDir')
export let leConfigDir = plugins.path.join(assetDir,'letsencrypt')
plugins.smartfile.fs.ensureDirSync(leConfigDir)
plugins.smartfile.fs.ensureDirSync(defaultSslDir)
