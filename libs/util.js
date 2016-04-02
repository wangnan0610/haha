var xlsx = require('xlsx');
var _ = require('lodash');
var fs = require('fs');
var xl = require('excel4node'); //用来写
var async = require('async');
var path = require('path');
var formula = require('./formula');

/**
 * TODO:注意正在打开的文件
 */

var EX = '.xlsx';
var DIR = path.join(__dirname, '../public/file3/');

exports.addFileEx = function(filename) {
  return filename + EX;
}

exports.delFileEx = function(filename) {
  return filename ? filename.slice(0, 0 - EX.length) : filename;
}

//如任务模块_011需要添加成为任务模块_011_2_result.xlsx
exports.addFileResult = function(filename, type) {
  var self = this;
  switch (type) {
    case 'therp':
      return self.addFileEx(filename + '_1_result');
    case 'gray':
      return self.addFileEx(filename + '_2_result');
    case 'cooper':
      return self.addFileEx(filename + '_3_result');
    default:
      console.error('类型错误');
      return null;
  }
}

//因为有好多专家打分，所以需要读取
exports.getFilesSp = function(filename, type) {
  var files = fs.readdirSync(DIR);

  if (type === 'gray') {
    filename = filename + '_2';
  } else {
    filename = filename + '_3';
  }

  files = _.filter(files, function(file) {
    return file.indexOf('~$') === -1 && file.indexOf(filename) >= 0;
  })
  return files;
}

//灰色值计算需要读取文件下所有专家的打分excel
//过滤类型type
exports.readFolder3 = function(type) {
  var files = fs.readdirSync(DIR);

  switch (type) {
    case 'therp':
      files = _.filter(files, function(f) {
        var arr = f.split('_');
        return arr.length === 3 && arr[2] == '1' + EX;
      })
      return files;
    case 'gray':
      files = _.filter(files, function(f) {
        var arr = f.split('_');
        return arr.length === 4 && arr[2] == 2;
      })
      return files;
    case 'cooper':
      files = _.filter(files, function(f) {
        var arr = f.split('_');
        return arr.length === 4 && arr[2] == 3;
      })
      return files;
    default:
      console.error('需要文件的类型不包括');
      return null;
  }
};

//从文件夹3读取文件，同时需要注意gary,cooper都需要特殊处理
exports.getFilenames = function(type) {
  var self = this;
  var files = self.readFolder3(type);
  files = _.filter(files, function(f) {
    return f.indexOf('~$') == -1;
  });
  if (type == 'therp') {
    files = _.map(files, function(f) {
      return self.delFileEx(f);
    });
    return files;

  } else if (type === 'gray' || type === 'cooper') {
    files = _.map(files, function(f) {
      var arr = f.split('_').slice(0, 2);
      return arr.join('_');
    })
    return _.uniq(files);

  } else {
    console.error('文件类型不匹配');
    return null;
  }
}


//read excel content
//return csv
exports.readExcel = function(file) {
  var wb = xlsx.readFile(file);

  var content = xlsx.utils.sheet_to_csv(wb.Sheets.sheet);

  return content;
}

/**
 * 不同类型的计算对应值不一样
 * therp
 * a: 任务类型
 * b: 允许作业人员进行相应的时间
 * c: 作业人员一般情况下的执行时间
 * d: 操作员经验
 * e: 心理压力
 * f: 人机界面
 * gray
 * a: 体力劳动强度打分
 * b: 脑力劳动强度打分
 * c: 体力作业复杂度打分
 * d: 脑力作业复杂度打分
 * cooper
 */
//根据读取的excel内容转化成jstree
exports.formatJsTree = function(csv, type) {
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
        if (type === 'therp') {
          o.data.b = data[4];
          o.data.c = data[5];
          o.data.d = data[6];
          o.data.e = data[7];
          o.data.f = data[8];
        } else if (type === 'gray') {
          o.data.b = data[4];
          o.data.c = data[5];
          o.data.d = data[6];
        } else { //默认cooper

        }
        tempObj.children.push(o);
        tempObj.data.children.push(o);
      }
    }
  })

  obj.data.count = count; //添加一个数字用来记录多少行，为其他的方便 

  return obj;
}

//arr to Obj
//多个专家的数据整合到一个对象上去后续处理
function arrToObj(arr, type) {
  function getExNo(file) {
    var arr = file.split('_');

    return arr[arr.length - 1].slice(0, -5);
  }

  if (type === 'gray') {
    var obj = {};
    if (!arr || arr.length === 0) {
      return arr;
    } else {
      _.each(arr, function(o, index) {
        //init
        if (index === 0) {
          obj = o.data;
        }
        var file = o.file;
        _.each(o.data.children, function(s, si) {
          _.each(s.data.children, function(t, ti) {
            var tmp = obj.data.children[si].data.children[ti].data['gd'];
            if (!tmp) {
              obj.data.children[si].data.children[ti].data['gd'] = [];
            }
            obj.data.children[si].data.children[ti].data['gd'].push({
              file: getExNo(file),
              data: {
                a: t.data.a,
                b: t.data.b,
                c: t.data.c,
                d: t.data.d,
              }
            })
          });
        })
      });

      //覆盖一些值
      obj.children = obj.data.children;
      _.each(obj.children, function(sub) {
        sub.children = sub.data.children;
      });

      return obj;
    }
  } else {

  }
}

//因为gray and cooper 多个专家打分，需要把数据再次和一遍
//输入的filename 很简单，不是完整的需要组合下
exports.formatJsTreeSp = function(filename, type, fn) {
  var self = this;

  if (type === 'gray') {
    var files = self.getFilesSp(filename, type);

    async.map(files, function(file, cb) {
      var error;
      var obj;
      try {
        var content = self.readExcel(path.join(DIR, file));
        var data = self.formatJsTree(content, 'gray');
        obj = {
          data: data,
          file: file
        }
      } catch (e) {
        error = e;
      }
      cb(error, obj);
    }, function(err, results) {
      //处理数据
      results = arrToObj(results, type);
      fn(err, results);
    })
  } else {

  }
};

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

//灰色计算
//由formatJsTreeSp得到的obj 而得
exports.getGray = function(obj) {
  var arr = [];

  _.each(obj.children, function(sub) {
    var subArr = [];
    _.each(sub.children, function(task) {
      var result = formula.grayTask(task.data.gd);
      task.data.gray = result;
      subArr.push(result);
    })

    var res = formula.graySubModule(subArr);
    sub.data.gray = res;
    arr.push(res);
  });

  var r = formula.grayModule(arr);
  obj.data.gray = r;

  return obj;
};

//cooper计算
exports.getCooper = function(arr) {

};

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

//将jstree可识别的gray对象转化成excel
exports.grayToExcel = function(file, obj) {
  var wb = new xl.WorkBook();
  var ws = wb.WorkSheet('sheet');

  //init
  ws.Cell(1, 1).String('任务模块');
  ws.Cell(1, 2).String('子任务模块');
  ws.Cell(1, 3).String('任务单元');
  ws.Cell(1, 4).String('任务单元得分');
  ws.Cell(1, 5).String('子任务模块得分');
  ws.Cell(1, 6).String('任务模块得分');

  var end = 2; //用来记录子任务模块最后到哪
  var p = 2; //用来跟踪任务单元到哪
  _.each(obj.children, function(sub) {
    _.each(sub.children, function(task) {
      console.log(task);
      ws.Cell(p, 3).String(task.text);
      ws.Cell(p, 4).Number(task.data.gray.s);
      p++;
    })
    var tmp = end;
    end += sub.children.length > 0 ? sub.children.length : 1;
    ws.Cell(tmp, 2, end - 1, 2, true).String(sub.text);
    ws.Cell(tmp, 5, end - 1, 5, true).Number(sub.data.gray);
  })

  ws.Cell(2, 1, end - 1, 1, true).String(obj.text);
  ws.Cell(2, 6, end - 1, 6, true).Number(obj.data.gray);

  wb.write(path.join(__dirname, '../public/file4/') + file);
};
