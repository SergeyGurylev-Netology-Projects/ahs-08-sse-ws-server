const { v4 } = require('uuid');

class Message {
  constructor(name, message) {
    this.id = v4();
    this.name = name;
    this.message = message;
    this.created = Date.now();
  }
}

module.exports = Message;
