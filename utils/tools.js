const fs = require('fs');
const { REG } = require('../config/reg_config');
const { CODE_ARRAY } = require('../config/code_config');
const query = require('./query');
exports.checkNick = nickname => {
    let reg1 = new RegExp(REG.NUM_SHORT);
    let reg2 = new RegExp(REG.NUM_LONG);
    let reg3 = new RegExp(REG.NUM_SPEC);
    let res1 = reg1.test(nickname);
    if (res1) {
        return CODE_ARRAY.NICK_ERROR.SHORT;
    }
    let res2 = reg2.test(nickname);
    if (res2) {
        return CODE_ARRAY.NICK_ERROR.LONG;
    }
    let res3 = reg3.test(nickname);
    if (!res3) {
        return CODE_ARRAY.NICK_ERROR.SPEC;
    }
    return CODE_ARRAY.NICK_ERROR.MEET;
}

//创建用户文件夹
exports.createUserFolder = userFolder => {
    fs.mkdir(userFolder, { recursive: true }, (err) => {
        if (err)
            throw err;
        else {
            fs.mkdir(userFolder + '/articles', { recursive: true }, (err2) => {
                if (err2) throw err2;
            })
            fs.mkdir(userFolder + '/data', { recursive: true }, (err2) => {
                if (err2) throw err2;
            })
            fs.mkdir(userFolder + '/images', { recursive: true }, (err2) => {
                if (err2) throw err2;
            })
        }
    })
}

//创建文集
exports.addAnth = async (uid, articleName) => {
    let sql = `INSERT INTO anthology VALUES (NULL, ?, ?)`;
    let res = await query(sql, [uid, articleName], res => {
        
        if (res.affectedRows > 0) {
            return {
                ...CODE_ARRAY.ANTH_CREATE.SUCCESS
            }
        } else {
            return CODE_ARRAY.ANTH_CREATE.FAIL;
        }
    })
    return res;
}
