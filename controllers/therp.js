var xlsx = require('xlsx');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('../libs/util');

var DIR = path.join(__dirname, '../public/file3/');

//人误率分析，默认读取file3下的文件名列表
exports.index = function(req, res) {
  var files = fs.readdirSync(DIR);

  files = _.filter(files, function(file) {
    return file.indexOf('_1.xlsx') !== -1;
  });

  res.render('therp', {
    files: files,
    jsTree: '',
    file: '',
  })
}

//打开对应的excel文件，并转换成jstree需要的json格式, 并且拿到therp数据
exports.openFile = function(req, res) {
  var filename = req.params.filename || '';

  var files = fs.readdirSync(DIR);

  if (files.indexOf(filename) === -1) { //文件不存在
    res.redirect('/therp');
  } else {
    var content = util.readExcel(path.join(DIR, filename));
    var obj = util.formatJsTree(content);
    obj = util.getTherp(obj);

    res.render('therp', {
      jsTree: JSON.stringify(obj),
      files: [],
      file: filename.slice(0, -5),
    })
  }
}

//将计算过的数据保存到excel里面
exports.saveFile = function(req, res) {
  var filename = req.params.filename || '';

  var files = fs.readdirSync(DIR);

  if (files.indexOf(filename) === -1) { //文件不存在
    res.json({
      code: 500,
      error: '文件不存在'
    })
  } else {
    var error;
    try {
      var content = util.readExcel(path.join(DIR, filename));
      var obj = util.formatJsTree(content);
      obj = util.getTherp(obj);
      util.therpToExcel(filename, obj);
    } catch (e) {
      error = e;
    }

    res.json({
      code: error ? 500 : 200,
      error: error || ''
    })

  }
}
