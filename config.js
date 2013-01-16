// var path = require('path');
exports.config = {
  debug: true,
  name: 'nodemail',
  description: '基于 nodejs 的 web 邮箱',
  version: '0.1.7',

  sessionSecret: 'nodemail',
  authCookieName: 'nodemail',
  host: '127.0.0.1',
  port: 3001,

  db: 'mongodb://127.0.0.1/nodemail'
};
