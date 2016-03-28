var xlsx = require('xlsx');
var _ = require('lodash');
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

  function createBaseObj(text) {
    return {
      text: text,
      data: {},
      children: []
    }
  }

  tempArr = csv.split('\n');

  _.each(tempArr, function(val, key) {
    if (key !== 0 && val) {
      var data = val.split(',');

      if (data[0]) { //任务模块
        obj = createBaseObj(data[0]);
      }

      if (data[1]) { //子任务模块
        var o = createBaseObj(data[1]);
        obj.children.push(o);
        tempObj = o;
      }

      if (data[2]) { //任务单元
        var o = createBaseObj(data[2]);
        o.data.a = data[3];
        o.data.b = data[4];
        o.data.c = data[5];
        o.data.d = data[6];
        o.data.e = data[7];
        o.data.f = data[8];
        tempObj.children.push(o);
      }
    }
  })

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
