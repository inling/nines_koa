const Router = require('koa-router');
const user_router = require('./children/user_router');
const router = new Router();

router.use(user_router.routes(), user_router.allowedMethods());

module.exports = router;
