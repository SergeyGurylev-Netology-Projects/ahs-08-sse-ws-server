const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const WS = require('ws');

const chat = require('./db/chat');
const router = require('./routes');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');

  if (ctx.request.get('Access-Control-Request-Headers')) {
    ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
  }

  await next();
});

// TODO: write code here

app.use(router());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server,
});

wsServer.on('connection', (ws) => {
  let userName;

  ws.on('message', (mes) => {
    const message = JSON.parse(mes);

    let data;

    switch (message.action) {
      case 'login':
        data = chat.findLoginByName(message.name);
        if (data && data.online) {
          userName = data.name;
          sendMessage('login', data);
        }
        return;

      case 'message':
        data = chat.findMessageById(message.id);
        if (data) {
          sendMessage('message', data);
        }
        return;

      case 'unload':
        data = chat.findLoginByName(message.name);
        if (data) {
          data.online = false;
          sendMessage('logout', data);
        }
    }
  });

  ws.on('close', () => {
    const data = chat.findLoginByName(userName);
    if (data) {
      data.online = false;
      sendMessage('logout', data);
    }
  });

  const sendMessage = function (action, data) {
    const jsonData = JSON.stringify({ ...{ action: action }, ...data });
    Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(jsonData));
  };

  sendMessage('initMessages', { messages: chat.messages });
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server is listening to ${port}`);
});
