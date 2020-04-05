/**
 * 0 : 通过
 * 4000-4099 :身份凭证
 * 4100-4199 :注册相关
 * 4200-4299 :用户信息
 * 4300-4399 :昵称异常
 * 5000 :token相关
 */

exports.CODE_ARRAY = {
    DEFAULT:{
        code:0
    },
    /**成功code */
    /**身份验证相关 */
    LOGIN_SUCCESS: {
        code: 0, message: '登录成功'
    },
    LOGIN_FAIL: {
        code: 4000, message: '登录失败'
    },
    LOGIN_ERROR: {
        code: 4001, message: '账号或密码错误'
    },

    FORMAT_ERROR: {
        code: 4002, message: '格式错误'
    },

    /**token相关 */
    TOKEN_OVERTIME: {
        code: 5000, message: '登录凭证已失效'
    },

    /**注册相关 */
    REGISTER_SUCCESS: {
        code: 0, message: '注册成功'
    },
    REGISTER_ADDMIT: {
        code: 0, message: '允许注册'
    },
    REGISTER_FAIL: {
        code: 4100, message: '注册失败'
    },
    NICKNAME_REPEAT: {
        code: 4101, message: '昵称已存在'
    },
    PHONE_REPEAT: {
        code: 4102, message: '手机号已被注册'
    },
    PASSWORD_SET_SUCCESS: {
        code: 0, message: '密码设置成功'
    },
    PASSWORD_SET_FAIL: {
        code: 4104, message: '密码设置失败'
    },

    /**OPTION */
    OPTION: {
        code: 200, message: '预检通过'
    },

    /**用户信息 */
    USERINFO_GET_SUCCESS: {
        code: 0, message: '获取用户信息成功'
    },
    USERINFO_GET_FAIL: {
        code: 4200, message: '获取用户数据异常'
    },

    /**key相关 */
    KEY_PU_ERR:{
        code: 4300, message: '获取公钥失败,用户不存在'
    },
    KEY_PR_ERR:{
        code: 4301, message: '获取私钥失败,用户不存在'
    },

    /**昵称校验 */
    NICK_ERROR: {
        MEET: {
            code: 0, message: '昵称允许注册'
        },
        SHORT: {
            code: 4400, message: '昵称过短'
        },
        LONG: {
            code: 4401, message: '昵称过长'
        },
        SPEC: {
            code: 4402, message: '昵称不可包含除-和_以外的特殊字符'
        }
    },

    VCODE_CHECK:{
        PASS:{
            code: 0 , message:'验证通过'
        },
        NOPASS:{
            code: 4500 , message:'验证码错误'
        }
    },

    /**手机号检查 */
    PHONE_CHECK:{
        ALLOW:{
            code: 0 , message:'手机号允许注册'
        },
        REPEAT:{
            code: 4600 , message:'手机号已被注册'
        }
    }
}

/**v1.0.0 */
