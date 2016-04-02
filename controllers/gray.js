//人机分配灰色

var xlsx = require('xlsx');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('../libs/util');


//人机分配灰色
exports.index = function(req, res) {
  var files = util.getFilenames('gray');

  res.render('gray', {
    files: files,
    jsTree: '',
    file: '',
  })
}

//对应打开excel所有文件，并且转成jstree需要的json格式，并且拿到gray数据
//需要读取所有专家的文件
exports.openFiles = function(req, res) {
  var filename = req.params.filename || '';

  var files = util.getFilenames('gray');

  if (files.indexOf(filename) === -1) {
    //文件不存在
    res.redirect('/gray');
  } else {
    util.formatJsTreeSp(filename, 'gray', function(err, results) {
      if (err) {
        console.error(err);
      }
      console.log(results);
      res.render('gray', {
        jsTree: JSON.stringify(results),
        files: [],
        file: filename
      })
    })
  }
}
