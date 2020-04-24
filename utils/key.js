const NodeRsa = require('node-rsa');
const crypto = require('crypto');
/**
 * 生成公钥私钥
 */
exports.createKey = () => {
    let key = new NodeRsa({ b: 512 });
    let publicKey = key.exportKey('public');
    let privateKey = key.exportKey('private');
    return { publicKey, privateKey }
}
/**
 * 公钥加密
 */
exports.encrypt = (publicKey, data) => {
    let key = new NodeRsa(publicKey);
    return key.encrypt(data, 'base64', 'utf8')
}
/**
 * 私钥解密
 */
exports.decrypt = (privateKey, data) => {
    let key = new NodeRsa(privateKey);
    key.setOptions({encryptionScheme: 'pkcs1'}); 
    return key.decrypt(data,'utf8')
}

/**
 * 转换md5
 */
exports.toMD5 = (password) => {
    //console.log(password)
    let m = crypto.createHash('md5');
    m.update(password, 'utf8');
    return m.digest('hex').toUpperCase();
}


/**v1.0.0 */
