const query = require('../../utils/query');
const { setToken, verToken } = require('../../utils/token');
const { CODE_ARRAY } = require('../../config/code_config');
const { createKey, decrypt, toMD5 } = require('../../utils/key');
const { sendSms } = require('../../utils/sms');
const { checkNick, createUserFolder, addAnth } = require('../../utils/tools');
//用户注册
exports.register = async (ctx, next) => {
    try {
        let { nickname, phone } = ctx.request.body;
        let { publicKey, privateKey } = createKey();
        let sql = `INSERT INTO user VALUES (NULL, ?, NULL, ?, NULL, 0, ?, ?, NULL, NULL, NULL, NULL)`;
        let res = await query(sql, [nickname, phone, publicKey, privateKey], res => {
            if (res.affectedRows > 0) {
                createUserFolder('./userData/' + phone);
                addAnth(res.insertId, '默认');
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

/**
 * 修改用户信息
 */
exports.editUserInfo = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { signature, gender, birthday, location } = ctx.request.body;
        signature = signature ? signature : "";
        gender = gender ? gender : "";
        birthday = birthday ? birthday : "";
        location = location ? location : "";
        let sql = `UPDATE user SET signature=?,gender=?,birthday=?,location=? WHERE phone=?`;
        let res = await query(sql, [signature, gender, birthday, location, userInfo.phone], res => {
            if (res.affectedRows > 0) {
                return CODE_ARRAY.USERINFO_EDIT_SUCCESS;
            } else {
                return CODE_ARRAY.USERINFO_EDIT_FAIL;
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 创建文集
 */
exports.addAnthology = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { anthologyName } = ctx.request.body;
        let res = await addAnth(userInfo.id, anthologyName);
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}
/**
 * 读取文集
 */
exports.getAnthology = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let sql = `select * from anthology WHERE uid=?`;
        let res = await query(sql, [userInfo.id], res => {
            if (res.length > 0) {
                return {
                    anthologyList: res,
                    ...CODE_ARRAY.ANTH_QUERY.SUCCESS
                }
            } else {
                return {
                    ...CODE_ARRAY.ANTH_QUERY.FAIL
                }
            }
        });
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 删除文集
 */
exports.deleteAnthology = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { anthologyId } = ctx.request.body;
        let sql = `DELETE from anthology WHERE id=? AND uid=?`;
        let res = await query(sql, [anthologyId, userInfo.id], res => {
            if (res.affectedRows > 0) {
                return {
                    ...CODE_ARRAY.ANTH_DELETE.SUCCESS
                }
            } else {
                return {
                    ...CODE_ARRAY.ANTH_DELETE.FAIL
                }
            }
        });
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}
/**
 * 添加文章
 */
exports.addArticle = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { anthologyId, articleName } = ctx.request.body;
        let sql = `INSERT INTO article VALUES (NULL, ?, ?, ?, NULL)`;

        let res = await query(sql, [userInfo.id, anthologyId, articleName], res => {
            if (res.affectedRows > 0) {
                return {
                    ...CODE_ARRAY.ARTICLE_CREATE.SUCCESS
                }
            } else {
                return CODE_ARRAY.ARTICLE_CREATE.FAIL;
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 获取文章列表
 */
exports.getArticle = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { anthologyId } = ctx.request.body;
        let sql = `SELECT * FROM article WHERE uid = ? AND anthologyId = ? order by id desc`;

        let res = await query(sql, [userInfo.id, anthologyId], res => {
            //if (res.length > 0) {
                return {
                    articleList:res,
                    ...CODE_ARRAY.ARTICLE_QUERY.SUCCESS
                }
            // } else {
            //     return CODE_ARRAY.ARTICLE_QUERY.FAIL;
            // }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 获取文章内容
 */
exports.getArticleText = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { articleId } = ctx.request.body;
        let sql = `SELECT articleText FROM article WHERE id = ? `;

        let res = await query(sql, [articleId], res => {
            return {
                article:res,
                ...CODE_ARRAY.ARTICLE_QUERY.SUCCESS
            }
        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 添加文章内容
 */
exports.setArticleText = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { articleId, articleText } = ctx.request.body;
        let sql = ` UPDATE article SET articleText = ? WHERE id = ? AND uid =?`

        let res = await query(sql, [articleText, articleId, userInfo.id], res => {
            if (res.affectedRows > 0) {
                return {
                    ...CODE_ARRAY.ARTICLE_CREATE.SET_SUCCESS
                }
            } else {
                return {
                    ...CODE_ARRAY.ARTICLE_CREATE.SET_FAIL
                }
            }

        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}

/**
 * 删除文章
 */
exports.deleteArticle = async (ctx, next) => {
    try {
        let token = ctx.headers.authorization;
        let userInfo = verToken(token);

        let { articleId } = ctx.request.body;
        let sql = ` DELETE FROM article WHERE id = ? AND uid=?`

        let res = await query(sql, [articleId, userInfo.id], res => {
            if (res.affectedRows > 0) {
                return {
                    ...CODE_ARRAY.ARTICLE_DELETE.SUCCESS
                }
            } else {
                return {
                    ...CODE_ARRAY.ARTICLE_DELETE.FAIL
                }
            }

        })
        ctx.body = res;
    } catch (err) {
        ctx.body = err;
    }
}
/**v1.0.0 */
