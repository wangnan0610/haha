var mongoose = require('mongoose');

//角色分为3种，root为最高权限，admin为管理员（设计人员），normal为普通人员
//root角色可以管理用户
//admin角色可以任务分配
//normal角色最基础

/**
 * 需要管理员权限
 */
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.render('notify/notify', {
      error: '你还没有登录'
    });
  }

  if (user.status !== 'pass' || user.role === 'normal') {
    return res.render('notify/notify', {
      error: '需要管理员权限'
    });
  }

  next();
};

/**
 * 需要root权限
 */
exports.rootRequired = function(req, res, next) {
  var user = req.session.user;
  
  if (!user) {
    return res.render('notify/notify', {
      error: '你还没有登录'
    });
  }

  if (user.status !== 'pass' || user.role !== 'root') {
    return res.render('notify/notify', {
      error: '需要ROOT权限'
    });
  }

  next();
}

/**
 * 用户是否认证,是否已经被ROOT管理员通过
 */
exports.userAuthenticated = function(req, res, next) {
  var user = req.session.user;

  if (user.status !== 'pass') {
    return res.render('notify/notify', {
      error: '您的账号还没有经过管理员的认证'
    })
  }

  next();
};


/**
 * 需要登录
 */
exports.userRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.render('notify/notify', {
      error: '你还没有登录'
    });
  }

  next();
}
