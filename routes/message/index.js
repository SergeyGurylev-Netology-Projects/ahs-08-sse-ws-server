const Router = require('koa-router');
const chat = require('../../db/chat');

const router = new Router();

router.post('/message', (ctx) => {
  const { name, message } = ctx.request.body;

  const result = chat.addMessage(name, message);

  ctx.response.body = result;
});

module.exports = router;
