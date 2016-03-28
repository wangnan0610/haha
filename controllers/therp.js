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
    jsTree: ''
  })
}

//打开对应的excel文件，并转换成jstree需要的json格式
exports.openFile = function(req, res) {
  var filename = req.params.filename || '';

  var files = fs.readdirSync(DIR);

  if (files.indexOf(filename) === -1) {//文件不存在
    res.redirect('/therp');
  } else {
    var content = util.readExcel(path.join(DIR, filename));
    var obj = util.formatJsTree(content);

    res.render('therp', {
      jsTree: JSON.stringify(obj),
      files: []
    }) 
  }
}

//根据excel 内容计算人误率
exports.getResult = function(req, res) {
  
}

