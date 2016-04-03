//Cooper-harper
var _ = require('lodash');
var util = require('../libs/util');

var m = {
  name: 'Cooper-harper评价法',
  slug: 'cooper',
  files: [],
  file: '',
  jsTree: '',
}

exports.index = function(req, res) {

  var files = util.getFilenames('cooper');
  m.files = files;

  res.render('cooper', {
    m: m
  });
}

//对应打开excel所有文件，并且转成jstree需要的json格式，并且拿到cooper数据
//需要读取所有专家的文件
exports.openFiles = function(req, res) {
  var filename = req.params.filename || '';

  var files = util.getFilenames('cooper');

  if (files.indexOf(filename) === -1) {
    //文件不存在
    res.redirect('/cooper');
  } else {
    util.formatJsTreeSp(filename, 'cooper', function(err, results) {
      if (err) {
        console.error(err);
      }
      results = util.getCooper(results);
      m.jsTree = JSON.stringify(results);
      m.file = filename;
      res.render('cooper', {
        m: m
      })
    })
  }
}

//将计算过的数据保存到excel里面
exports.saveFile = function(req, res) {
  //filename params 任务模块_011

  var error;

  try {
    var obj = req.body;

    var file = util.addFileResult(req.params.filename, 'cooper');

    util.cooperToExcel(file, obj);

  } catch (e) {
    console.error(e.stack);
    error = e;
  }

  res.json({
    code: error ? 500 : 200,
    error: error
  })

}
