const koajwt = require('koa-jwt');
const { TOKEN_SECRET } = require('../config/serect_config');
const { CODE_ARRAY } = require('../config/code_config');
//Token 异常处理 401
exports.token_errors = async (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                ...CODE_ARRAY.TOKEN_OVERTIME,
                data: err.message      
            }
        } else {
            throw err;
        }
    })
}

//Token 路由过滤
exports.token_filter = koajwt({ secret: TOKEN_SECRET }).unless({
    path: [
        /^\/login/,
        /^\/nickname/,
        /^\/register/,
        /^\/pk/,
        /^\/setPassword/,
        /^\/sendSMS/,
        /^\/checkSMS/,
        /^\/phoneIsExist/
    ]
})

/**v1.0.0 */
