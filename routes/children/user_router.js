const Router = require('koa-router');
const user_controller = require('../controllers/user_controller');
const router = new Router();

router.post('/login', user_controller.login);
router.post('/register', user_controller.register);
router.post('/setPassword',user_controller.setPassword);
router.post('/pk',user_controller.pk);
router.post('/sendSMS', user_controller.sendSMS);
router.post('/checkSMS',user_controller.checkSMS);
router.get('/nickname',user_controller.nickname);
router.get('/getUserInfo',user_controller.getUserInfo);
router.get('/phoneIsExist',user_controller.phoneIsExist);
router.post('/editUserInfo',user_controller.editUserInfo);
router.post('/getAnthology',user_controller.getAnthology);
router.post('/addAnthology',user_controller.addAnthology);
router.post('/deleteAnthology',user_controller.deleteAnthology);
router.post('/addArticle',user_controller.addArticle);
router.post('/getArticle',user_controller.getArticle);
router.post('/getArticleText',user_controller.getArticleText);
router.post('/setArticleText',user_controller.setArticleText);

module.exports = router;

/**v1.0.0 */
