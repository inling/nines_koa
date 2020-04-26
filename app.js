const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const statics = require('koa-static');
const path = require('path');
const { response_header } = require('./middlewares/response_header');
const { token_errors, token_verify, token_filter } = require('./middlewares/token_jwt');
const { SESSION_CONFIG } = require('./config/session_config');
const { SESSION_SECRET } = require('./config/serect_config');
const routes = require('./routes/routes');
const app = new Koa();
app.use(bodyParser());


const staticPath = './statics'

app.use(statics(
  path.join(__dirname, staticPath)
))

//设置响应头 Response Header-跨域
app.use(response_header);

//Token 异常处理401
app.use(token_errors);
//Token 路由过滤
app.use(token_filter);

app.keys = ['some secret hurr'];   /*cookie的签名*/
//配置session的中间件
app.use(session({ maxAge: 300000}, app));  // maxAge--cookie的过期时间

//应用路由模块
app.use(routes.routes(), routes.allowedMethods())

app.listen(442, () => {
  console.log('启动成功')
});

/**v1.0.0 */
