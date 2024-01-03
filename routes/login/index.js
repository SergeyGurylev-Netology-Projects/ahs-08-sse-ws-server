const Router = require('koa-router');
const chat = require('../../db/chat');

const router = new Router();

router.get('/login/:name', (ctx) => {
  const { name } = ctx.params;

  const login = chat.findLoginByName(name);

  if (login) {
    ctx.response.body = { status: login.online ? 0 : 1, name: name, description: `user name '${name}' ${login.online ? 'online' : 'offline'}` };
  } else {
    ctx.response.body = { status: 2, name: name, description: `user name '${name}' doesn't exist` };
  }
});

router.post('/login', (ctx) => {
  const { name } = ctx.request.body;

  const result = chat.addLogin(name);
  const onlineLogins = chat.logins.filter(el => el.online).sort((a, b) => (a.name < b.name ? -1 : 1));

  ctx.response.body = { ...result, ...{ logins: onlineLogins } };
});

module.exports = router;
