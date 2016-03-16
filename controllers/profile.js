//profile

var User = require('../proxy/user');

exports.show = function(req, res) {
  res.render('profile/show', {
    user: req.session.user,
    tab: 'Profile'
  });
};

