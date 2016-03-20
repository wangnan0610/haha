var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var xl = require('excel4node');


//任务分配
exports.index = function(req, res) {
  res.render('task');
}

//新建任务
//从post来的数据转化成所需格式
//为每一个节点添加begin, end 用于excel
//role 1:任务2:子任务3:任务单元

function parseArr(arr) {
  console.log(arr);
  var obj = {};

  //第一遍循环找任务单元
  _.each(arr, function(o) {
    if (o.parent !== '#') {
      if (o.parent == 'j1_1') {
        if (!obj[o.id]) {
          o.children = 0;
          o.num = 0;
          obj[o.id] = o;
        }
      } else {
        obj[o.parent].children++;
      }
    }
  })

  //第二遍循环标记
  var begin = 2;
  var end = 2;
  _.each(arr, function(o) {
    if (o.parent === '#') {
      o.role = 1;
    } else if (o.parent === 'j1_1') {
      o.role = 2;
      o.begin = begin;
      o.end = begin + (o.children > 1 ? o.children - 1 : 0);
      begin = o.end + 1;
      end = o.end;
    } else {
      o.role = 3;
    }
  })

  //第三遍循环标记
  _.each(arr, function(o) {
    if (o.parent === '#') {
      o.begin = 2;
      o.end = end;
    } else if (o.parent !== 'j1_1') {
      o.begin = obj[o.parent].begin + obj[o.parent].num;
      obj[o.parent].num++;
      o.end = o.begin;
    } else {
      //
    }
  })

  return arr;
}


//1: 001, 11: 011, 101: 101
function formatFilename(num) {
  if (num < 10) {
    return '00' + num;
  } else if (num < 100) {
    return '0' + num;
  } else {
    return num;
  }
}

//获取文件名
function getFilename(str) {

  var filenames = fs.readdirSync(path.join(__dirname, '../public/file1'));
  var filename = str;
  var num = 1;

  _.each(filenames, function(file) {
    if (file.indexOf(filename) !== -1) {
      num++;
    }
  })

  filename = filename + '_' + formatFilename(num);
  return filename;
}

function excel(arr, filename) {
  var wb = new xl.WorkBook();
  var ws = wb.WorkSheet('sheet');

  //init
  ws.Cell(1, 1).String('任务模块');
  ws.Cell(1, 2).String('子任务模块');
  ws.Cell(1, 3).String('任务单元');
  _.each(arr, function(o) {
    if (o.role === 1) {
      ws.Cell(o.begin, 1, o.end, 1, true).String(o.text);
    } else if (o.role === 2) {
      ws.Cell(o.begin, 2, o.end, 2, true).String(o.text);
    } else {
      ws.Cell(o.begin, 3, o.end, 3, false).String(o.text);
    }
  });

  wb.write(path.join(__dirname, '../public/file1/') + filename + '.xlsx');
}
exports.create = function(req, res) {
  var datas = JSON.parse(req.body.data) || [];

  if (datas.length === 0) {
    res.json({
      code: '500',
      error: '数据为空'
    })
  } else {
    var flag = true;
    try {
      datas = parseArr(datas);
      var filename = getFilename(datas[0].text);
      excel(datas, filename);
    } catch (e) {
      console.log(e.stack);
      flag = false;
    }
    if (flag) {
      res.json({
        code: '200',
        task: filename,
      })
    } else {
      res.json({
        code: '500'
      })
    }
  }
}

//生成调研表
//1: 人误率调研表
//2: 体力脑力劳动强度及作业复杂度评分表
//3: 操作难易程度Cooper-harper评分表 
function createSurveyExcel(arr, task, type) {
  var dir = path.join(__dirname, '../public/file2/');
  var wb = new xl.WorkBook();
  var ws = wb.WorkSheet('sheet');
  var end = 1;

  //init
  ws.Cell(1, 1).String('任务模块');
  ws.Cell(1, 2).String('子任务模块');
  ws.Cell(1, 3).String('任务单元');
  _.each(arr, function(o) {
    if (o.role === 1) {
      ws.Cell(o.begin, 1, o.end, 1, true).String(o.text);
      //记录最后的表格
      end = o.end;
    } else if (o.role === 2) {
      ws.Cell(o.begin, 2, o.end, 2, true).String(o.text);
    } else {
      ws.Cell(o.begin, 3, o.end, 3, false).String(o.text);
    }
  });

  if (type === 1) {
    ws.Cell(1, 4).String('行为类型');
    ws.Cell(1, 5).String('允许作业人员进行相应的时间');
    ws.Cell(1, 6).String('作业人员一般情况下的执行时间');
    ws.Cell(1, 7).String('操作员经验');
    ws.Cell(1, 8).String('心理压力');
    ws.Cell(1, 9).String('人机界面');

    ws.setValidation({
      type: 'list',
      allowBlank: 1,
      showInputMessage: 1,
      showErrorMessage: 1,
      sqref: 'D2:D' + end,
      formulas: [
        '技能型,规则性,知识型'
      ]
    });
    ws.setValidation({
      type: 'list',
      allowBlank: 1,
      showInputMessage: 1,
      showErrorMessage: 1,
      sqref: 'G2:G' + end,
      formulas: [
        '专家,平均训练水平,新手'
      ]
    });
    ws.setValidation({
      type: 'list',
      allowBlank: 1,
      showInputMessage: 1,
      showErrorMessage: 1,
      sqref: 'H2:H' + end,
      formulas: [
        '严重应激情景,低度应激/放松情况,最佳应激情况/正常,潜在应激情景/高工作负荷'
      ]
    });
    ws.setValidation({
      type: 'list',
      allowBlank: 1,
      showInputMessage: 1,
      showErrorMessage: 1,
      sqref: 'I2:I' + end,
      formulas: [
        '优秀,良好,中等,较差,极差'
      ]
    });

    wb.write(path.join(__dirname, '../public/file2/') + task + '_1.xlsx');
  } else if (type === 2) {
    ws.Cell(1, 4).String('体力劳动强度打分');
    ws.Cell(1, 5).String('脑力劳动强度打分');
    ws.Cell(1, 6).String('体力作业复杂度打分');
    ws.Cell(1, 7).String('脑力作业复杂度打分');

    wb.write(path.join(__dirname, '../public/file2/') + task + '_2.xlsx');
  } else {
    ws.Cell(1, 4).String('Cooper-Harper打分');

    wb.write(path.join(__dirname, '../public/file2/') + task + '_3.xlsx');
  }

}
exports.createSurvey = function(req, res) {
  var flag = true;
  try {
    var task = req.body.task;
    var datas = parseArr(JSON.parse(req.body.data));
    createSurveyExcel(datas, task, 1);
    createSurveyExcel(datas, task, 2);
    createSurveyExcel(datas, task, 3);
  } catch (e) {
    console.error(e.stack);
    flag = false;
  }

  if (flag) {
    res.json({
      code: '200',
    })
  } else {
    res.json({
      code: '500'
    })
  }

}
