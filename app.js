var path = require('path');
var express = require('express');
var config = require('./config').config;
var routes = require('./routes');

var app = express.createServer();

app.configure(function() {
  var viewsRoot = path.join(__dirname, 'views');
  app.set('views engine', 'html');
  app.set('views', viewsRoot);
  app.register('.html', require('ejs'));

  // app.use(express.bodyParser({
  // }));
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.sessionSecret
  }));
});

// set static, dynamic helpers
// 为 layout.html 绑定数据
app.helpers({
  config: config
});

routes(app);

app.listen(config.port);

// 设置静态资源根目录
var staticDir = path.join(__dirname, 'public');
app.configure('development', function() {
  app.use(express.static(staticDir));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

console.log(config.host + ':' + config.port);
module.exports = app;