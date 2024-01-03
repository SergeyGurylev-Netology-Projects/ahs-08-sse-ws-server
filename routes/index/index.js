const Router = require('koa-router');

const router = new Router();

router.get('/index', async (ctx) => {
  ctx.response.body = 'It\'s working!';
});

module.exports = router;
