var xlsx = require('xlsx');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('../libs/util');

var DIR = path.join(__dirname, '../public/file3/');


var m = {
  name: '人误率分析',
  slug: 'therp',
  files: [],
  file: '',
  jsTree: '',
}

//人误率分析，默认读取file3下的文件名列表
exports.index = function(req, res) {
  //var files = util.readFolder3('therp');

  //res.render('therp', {
  //files: files,
  //jsTree: '',
  //file: '',
  //})
  var files = util.getFilenames('therp');
  m.files = files;

  res.render('therp', {
    m: m
  })
}

//打开对应的excel文件，并转换成jstree需要的json格式, 并且拿到therp数据
exports.openFile = function(req, res) {
  var filename = req.params.filename || '';

  var files = util.getFilenames('therp');

  if (files.indexOf(filename) === -1) { //文件不存在
    res.redirect('/therp');
  } else {
    //var content = util.readExcel(path.join(DIR, filename));
    var obj = util.formatJsTree(filename, 'therp');
    obj = util.getTherp(obj);

    m.jsTree = JSON.stringify(obj);
    m.files = [];
    m.file = filename;

    res.render('therp', {
      m: m
    })
  }
}

//将计算过的数据保存到excel里面
exports.saveFile = function(req, res) {
  //filename params 任务模块
  var filename = req.params.filename || '';

  var error;

  try {
    var obj = req.body;

    var file = util.addFileResult(req.params.filename, 'therp');

    util.therpToExcel(file, obj);
  } catch (e) {
    console.error(e.stack);
    error = e;
  }

  res.json({
    code: error ? 500 : 200,
    error: error
  })

}
