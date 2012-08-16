var path = require('path');
var express = require('express');
var config = require('./config').config;
var routes = require('./routes');

var app = express.createServer();

app.configure(function() {
  var viewsRoot = path.join(__dirname, 'views');
  // View 默认的根目录为 viewsRoot 的值
  app.set('views', viewsRoot);
  // View 引擎默认处理 html 后缀
  app.set('views engine', 'html');
  //  启用 View 缓存（在开发阶段被关闭）
  app.set('view cache', false);
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
  // 在 HTML 页面中显示程序传递和抛出的异常
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

console.log(config.host + ':' + config.port);
module.exports = app;