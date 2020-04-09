const query = require('../../utils/query');
const { setToken, verToken } = require('../../utils/token');
const { CODE_ARRAY } = require('../../config/code_config');
const { createKey, decrypt, toMD5 } = require('../../utils/key');
const { sendSms } = require('../../utils/sms');
const { checkNick, createUserFolder } = require('../../utils/tools');
//用户注册
exports.register = async (ctx, next) => {
    try {
        let { nickname, phone } = ctx.request.body;
        let { publicKey, privateKey } = createKey();
        let sql = `INSERT INTO user VALUES (NULL, ?, NULL, ?, NULL, 0, ?, ?)`;
        let res = await query(sql, [nickname, phone, publicKey, privateKey], res => {
            if (res.affectedRows > 0) {
                createUserFolder('./userData/' + phone)
                return {
                    ...CODE_ARRAY.REGISTER_SUCCESS,
                    pk: publicKey
                }
            } else {
                return CODE_ARRAY.REGISTER_FAIL;
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

//设置用户密码
exports.setPassword = async (ctx, next) => {
    try {
        let { nickname, password } = ctx.request.body;
        let sqlKey = `SELECT privateKey FROM user WHERE nickname = ?`;
        let privateKey = await query(sqlKey, [nickname], res => {
            if (res.length > 0) {
                let k = res[0].privateKey;
                return k;
            } else {
                return undefined;
            }
        })
        if (!privateKey) {
            ctx.body = CODE_ARRAY.KEY_PR_ERR;
        }
        let passwordDecrypt = decrypt(privateKey, password);
        let passwordMD5 = toMD5(passwordDecrypt);
        let sql = `UPDATE user SET password = ? WHERE nickname = ?`;
        let res = await query(sql, [passwordMD5, nickname], res => {
            if (res.affectedRows > 0) {
                return CODE_ARRAY.PASSWORD_SET_SUCCESS;
            } else {
                return CODE_ARRAY.PASSWORD_SET_FAIL;
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

//用户登陆
exports.login = async (ctx, next) => {
    try {
        let { phone, password } = ctx.request.body;
        let sqlKey = `SELECT privateKey FROM user WHERE phone = ?`;
        let privateKey = await query(sqlKey, [phone], res => {
            if (res.length > 0) {
                let k = res[0].privateKey;
                return k;
            } else {
                return undefined;
            }
        })
        if (!privateKey) {
            ctx.body = CODE_ARRAY.KEY_PR_ERR;
        }
        let passwordDecrypt = decrypt(privateKey, password);
        let passwordMD5 = toMD5(passwordDecrypt);
        let sql = `SELECT * FROM user WHERE phone=? AND password=?`;
        let res = await query(sql, [phone, passwordMD5], res => {
            if (res.length > 0) {
                let token = setToken({ phone: phone, id: res[0].id });
                return { ...CODE_ARRAY.LOGIN_SUCCESS, token: token };
            } else {
                return CODE_ARRAY.LOGIN_FAIL;
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

//验证昵称是否存在
exports.nickname = async (ctx, next) => {
    try {
        let { nickname } = ctx.query;
        let checkRes = checkNick(decodeURIComponent(nickname));
        if (checkRes.code != 0) {
            ctx.body = checkRes;
            return;
        }
        let sql = `SELECT id FROM user WHERE nickname=?`;
        let res = await query(sql, [nickname], res => {
            if (res.length > 0) {
                return CODE_ARRAY.NICKNAME_REPEAT
            } else {
                return CODE_ARRAY.REGISTER_ADDMIT
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 获取用户信息
 */
exports.getUserInfo = async (ctx, next) => {
    let token = ctx.headers.authorization;
    if (token == undefined) {
        ctx.body = CODE_ARRAY.USERINFO_GET_FAIL;
        await next();
    } else {
        let userInfo = verToken(token);
        ctx.state.userInfo = userInfo;
        ctx.body = {
            ...CODE_ARRAY.USERINFO_GET_SUCCESS,
            userInfo: userInfo
        };
        await next();
    }
}

/**
 * 获取公钥
 */
exports.pk = async (ctx, next) => {
    try {
        let { phone } = ctx.request.body;
        let sql = `SELECT publicKey FROM user WHERE phone=?`;
        let res = await query(sql, [phone], res => {
            if (res.length > 0) {
                return { ...CODE_ARRAY.DEFAULT, pk: res[0].publicKey }
            } else {
                return CODE_ARRAY.KEY_PU_ERR
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 检查手机是否被注册
 */
exports.phoneIsExist = async (ctx, next) => {
    try {
        let { phone } = ctx.query;
        let decodePhone = decodeURIComponent(phone);
        if (!decodePhone) {
            ctx.body = CODE_ARRAY.FORMAT_ERROR;
            return;
        }
        let sql = `SELECT id FROM user WHERE phone=?`;
        let res = await query(sql, [decodePhone], res => {
            if (res.length > 0) {
                return CODE_ARRAY.PHONE_CHECK.REPEAT
            } else {
                return CODE_ARRAY.PHONE_CHECK.ALLOW
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}
/**
 * 发送验证码
 */
exports.sendSMS = async (ctx, next) => {
    let { phone } = ctx.request.body;
    phone = phone.toString()
    let paramCode = '';
    for (let i = 0; i < 6; i++) {
        paramCode = paramCode + '' + Math.floor(Math.random() * 10)
    }
    let param = { 'code': paramCode }
    await sendSms(phone, JSON.stringify(param), res => {
        ctx.session.smsCode = paramCode;
        ctx.body = res;
    })
    await next();
}

/**
 * 验证验证码
 */
exports.checkSMS = async (ctx, next) => {
    let { vCode } = ctx.request.body;
    if (vCode == ctx.session.smsCode) {
        ctx.body = CODE_ARRAY.VCODE_CHECK.PASS;
    } else {
        ctx.body = CODE_ARRAY.VCODE_CHECK.NOPASS;
    }
    await next();
}

/**v1.0.0 */
