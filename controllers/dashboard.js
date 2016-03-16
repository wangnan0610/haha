//主面板
exports.index = function(req, res) {
  res.render('dashboard', {user: req.session.user});
}

//了解更多
exports.about = function(req, res) {
  res.render('about');
}

//使用说明
exports.introduction = function(req, res) {
  res.render('introduction');
}

//联系我们
exports.contact = function(req, res) {
  res.render('contact');
}
