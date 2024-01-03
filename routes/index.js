const combineRouters = require('koa-combine-routers');

const index = require('./index/index');
const login = require('./login/index');
const message = require('./message/index');

const router = combineRouters(
  index,
  login,
  message,
);

module.exports = router;
