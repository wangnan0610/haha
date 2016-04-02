var xlsx = require('xlsx');
var _ = require('lodash');
var xl = require('excel4node'); //用来写
var path = require('path');
var formula = require('./formula');


//read excel content
//return csv
exports.readExcel = function(file) {
  var wb = xlsx.readFile(file);

  var content = xlsx.utils.sheet_to_csv(wb.Sheets.sheet);

  return content;
}

/**
 * a: 任务类型
 * b: 允许作业人员进行相应的时间
 * c: 作业人员一般情况下的执行时间
 * d: 操作员经验
 * e: 心理压力
 * f: 人机界面
 */
//根据读取的excel内容转化成jstree
exports.formatJsTree = function(csv) {
  var tempArr = [];
  var tempObj = {};
  var obj = {};

  function createBaseObj(text, role) {
    return {
      text: text,
      data: {
        role: role,
        text: text,
        children: [],
      },
      children: []
    }
  }

  tempArr = csv.split('\n');
  var count = 0;

  _.each(tempArr, function(val, key) {
    if (key !== 0 && val) {
      var data = val.split(',');
      count++;

      if (data[0]) { //任务模块
        obj = createBaseObj(data[0], 1);
      }

      if (data[1]) { //子任务模块
        var o = createBaseObj(data[1], 2);
        obj.children.push(o);
        obj.data.children.push(o);
        tempObj = o;
      }

      if (data[2]) { //任务单元
        var o = createBaseObj(data[2], 3);
        o.data.a = data[3];
        o.data.b = data[4];
        o.data.c = data[5];
        o.data.d = data[6];
        o.data.e = data[7];
        o.data.f = data[8];
        tempObj.children.push(o);
        tempObj.data.children.push(o);
      }
    }
  })

  obj.data.count = count;//添加一个数字用来记录多少行，为其他的方便 

  return obj;
}

//人误率计算
//由fomartJsTree得到的obj而得
exports.getTherp = function(obj) {
  var arr = [];

  _.each(obj.children, function(sub) {
    var subArr = [];
    _.each(sub.children, function(task) {
      var result = formula.therpTask(task.data.a, parseFloat(task.data.b), parseFloat(task.data.c), task.data.d, task.data.e, task.data.f);
      task.data.therp = result;
      subArr.push(result);
    })

    var res = formula.therpSubModule(subArr);
    sub.data.therp = res;
    arr.push(res);
  });

  var r = formula.therpModule(arr);
  obj.data.therp = r;

  return obj;
}

//将jstree可识别的therp对象转化成excel
exports.therpToExcel = function(file, obj) {
  var wb = new xl.WorkBook();
  var ws = wb.WorkSheet('sheet');

  //init
  ws.Cell(1, 1).String('任务模块');
  ws.Cell(1, 2).String('子任务模块');
  ws.Cell(1, 3).String('任务单元');
  ws.Cell(1, 4).String('任务单元人误率');
  ws.Cell(1, 5).String('子任务模块人误率');
  ws.Cell(1, 6).String('任务模块人误率');

  var end = 2; //用来记录子任务模块最后到哪
  var p = 2; //用来跟踪任务单元到哪
  _.each(obj.children, function(sub) {
    _.each(sub.children, function(task) {
      console.log(task);
      ws.Cell(p, 3).String(task.text);
      ws.Cell(p, 4).Number(task.data.therp);
      p++;
    })
    var tmp = end;
    end += sub.children.length > 0 ? sub.children.length : 1;
    ws.Cell(tmp, 2, end - 1, 2, true).String(sub.text);
    ws.Cell(tmp, 5, end - 1, 5, true).Number(sub.data.therp);
  })

  ws.Cell(2, 1, end - 1, 1, true).String(obj.text);
  ws.Cell(2, 6, end - 1, 6, true).Number(obj.data.therp);

  wb.write(path.join(__dirname, '../public/file4/') + file + '_1_result.xlsx');

}
