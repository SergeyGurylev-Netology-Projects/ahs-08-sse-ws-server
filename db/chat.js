const Login = require('./login');
const Message = require('./message');

const chat = {
  messages: [],
  logins: [],

  addMessage(name, message) {
    const newMessage = new Message(name, message);
    this.messages.push(newMessage);

    const status = 1;
    const description = `message '${message}' was added in chat`;

    return { ...{ status: status, description: description }, ...newMessage };
  },

  findLoginByName(name) {
    return this.logins.find(el => el.name === name);
  },

  addLogin(name) {
    const login = this.findLoginByName(name);

    let status; let description; let
      newLogin;

    if (login && login.online) {
      status = 0;
      description = `user name '${name}' already online`;
    } else if (login && !login.online) {
      status = 2;
      description = `user name '${name}' was switched to online`;
      login.online = true;
    } else {
      status = 1;
      description = `user name '${name}' was added in chat`;

      newLogin = new Login(name);
      this.logins.push(newLogin);
    }

    return { ...{ status: status, description: description }, ...newLogin };
  },

  findMessageById(id) {
    return this.messages.find(el => el.id === id);
  },
};

module.exports = chat;
