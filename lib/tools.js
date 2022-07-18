const qiniu = require("qiniu")
const fs = require('fs');

exports.uploadImageByStream = async (readableStream, fileName, mergeOptions) => {
    if (!mergeOptions.scope) {
        console.error(new Error('mergeOptions.scope can not be null'))
        return
    }
    if (!mergeOptions.zone) {
        console.error(new Error('mergeOptions.zone can not be null'))
        return
    }
    const mac = new qiniu.auth.digest.Mac(mergeOptions.accessKey, mergeOptions.secretKey);
    const config = new qiniu.conf.Config();
    // cloud Zone
    // you can find your setting on your qiniu.com dashboard setting.
    config.zone = mergeOptions.zone || qiniu.zone.Zone_z2;
    config.useHttpsDomain = mergeOptions.useHttpsDomain;
    config.useCdnDomain = mergeOptions.useCdnDomain;
    const options = {
        scope: mergeOptions.scope,
        callbackBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
        callbackBodyType: 'application/json'
    }
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken= await putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    // eslint-disable-next-line no-undef
    return new Promise((resolved, reject) => {
        formUploader.putStream(uploadToken, `${mergeOptions.remoteFilePath}/${fileName || (new Date().getTime() + '.jpg')}`, readableStream , putExtra,
            async function(respErr, respBody, respInfo) {
                if (respErr) {
                    reject(respErr)
                }
                if (respInfo && respInfo.statusCode == 200) {
                    const cdnUrl = `${mergeOptions.baseQiNiuCdnApi}/${respBody.key}`
                    console.log(cdnUrl)
                    resolved(cdnUrl)
                } else {
                    reject(respBody)
                }
            });
    })
}
// 删除文件
exports.removeTemFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            throw err
        }
    })
}
// sleep
exports.sleep = async (ms) => {
    // eslint-disable-next-line no-undef
    return new Promise(resolve=>setTimeout(resolve, ms))
}
