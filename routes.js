var path = require('path');
var sign = require('./controllers/sign');
var auth = require('./middlewares/auth');

//主面板
var dashboard = require('./controllers/dashboard');

//四个模块
var task = require('./controllers/task');
var therp = require('./controllers/therp');
var gray = require('./controllers/gray');
var cooper = require('./controllers/cooper');

//用户管理系统
var user = require('./controllers/user');

module.exports = function(app) {

  //sign
  app.get('/', sign.index);
  app.get('/register', sign.showRegister);
  app.post('/register', sign.register);
  app.get('/login', sign.showLogin);
  app.post('/login', sign.login);
  app.get('/logout', sign.logout);

  //dashboard
  app.get('/dashboard', auth.userAuthenticated, dashboard.index);
  app.get('/contact', dashboard.contact);
  app.get('/about', dashboard.about);
  app.get('/introduction', dashboard.introduction);

  //task
  app.get('/task', auth.adminRequired, task.index);
  app.post('/task/create', auth.adminRequired, task.create);
  app.post('/task/survey/create', auth.adminRequired, task.createSurvey);

  //therp
  app.get('/therp', therp.index);
  app.get('/therp/:filename', therp.openFile);
  app.post('/therp/:filename', therp.saveFile);

  //gray
  app.get('/gray', gray.index);
  app.get('/gray/:filename', gray.openFiles);
  app.post('/gray/:filename', gray.saveFile);
  
  //cooper
  app.get('/cooper', cooper.index);
  app.get('/cooper/:filename', cooper.openFiles);
  app.post('/cooper/:filename', cooper.saveFile);

  //user
  app.get('/user', auth.rootRequired, user.index);

}
