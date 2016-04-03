//所用公式
_ = require('lodash');

//参数需要
function getAction(action) {
  if (action == '技能型') {
    return {
      a: 0.407,
      b: 1.2,
      c: 0.7
    }
  } else if (action == '规则型') {
    return {
      a: 0.601,
      b: 0.9,
      c: 0.6
    }

  } else if (action === '知识型') {
    return {
      a: 0.791,
      b: 0.8,
      c: 0.5
    }

  } else {
    return {
      a: 0,
      b: 0,
      c: 0
    }
  }
};

function getExperience(experience) {
  switch (experience) {
    case '专家':
      return -0.22;
    case '平均训练水平':
      return 0.00;
    case '新手':
      return 0.44;
  }
};

function getInter(inter) {
  switch (inter) {
    case '优秀':
      return -0.22;
    case '良好':
      return 0.00;
    case '中等':
      return 0.44;
    case '较差 ':
      return 0.78;
    case '极差':
      return 0.92;
  }
};

function getPress(press) {
  if (press.indexOf('严重') !== -1) {
    return 0.44;
  } else if (press.indexOf('放松') !== -1) {
    return 0.28;
  } else if (press.indexOf('正常') !== -1) {
    return 0.00;
  } else if (press.indexOf('高工作') !== -1) {
    return 0.28;
  }
}

//人误率
//任务单元
exports.therpTask = function(action, t1, t, experience, press, inter) {
  var paramObj = getAction(action);
  var k1 = getExperience(experience);
  var k2 = getPress(press);
  var k3 = getInter(inter);
  var t2 = t * (1 + k1) * (1 + k2) * (1 + k3);
  console.log('参数: ', paramObj, k1, k2, k3, t2);

  var result = Math.exp(-Math.pow((t1 / t2 - paramObj.c) / paramObj.a, paramObj.b));

  return result;
}

//人误率
//子任务模块
//TODO:有个参数不知道，暂时先加
exports.therpSubModule = function(arr) {
  var result = 0;
  _.each(arr, function(p) {
    result += p;
  })

  return result;
}

//人误率
//任务模块
//TODO
exports.therpModule = function(arr) {
  var result = 0;
  _.each(arr, function(p) {
    result += p;
  })

  return result;
}

//灰色
//任务单元
//{file: file, data: {a, b, c, d}} //file表示专家，a、b、c、d表示各个指标
exports.grayTask = function(arr) {
  //专家数
  var m = arr.length;

  // 各个指标属性综合 
  var d1 = 0;
  var d2 = 0;
  var d3 = 0;
  var d4 = 0;
  _.each(arr, function(o) {
    d1 += o.data.a;
    d2 += o.data.b;
    d3 += o.data.c;
    d4 += o.data.d;
  });

  //正规化系数k
  var k = 1 / (0.6478 * m);

  //TODO 各个因子的嫡
  var e1 = 0;
  var e2 = 0;
  var e3 = 0;
  var e4 = 0;
  _.each(arr, function(o) {
    var x1 = (o.data.a / d1);
    var x2 = (o.data.b / d2);
    var x3 = (o.data.c / d3);
    var x4 = (o.data.d / d4);

    var tmp1 = x1 * Math.log(x1);
    var tmp2 = x2 * Math.log(x2);
    var tmp3 = x1 * Math.log(x3);
    var tmp4 = x1 * Math.log(x4);

    e1 += tmp1;
    e2 += tmp2;
    e3 += tmp3;
    e4 += tmp4;
  })

  e1 = k * e1;
  e2 = k * e2;
  e3 = k * e3;
  e4 = k * e4;

  //计算各个因子熵的总和
  var e = 0;
  e = e1 + e2 + e3 + e4;

  //计算相对的权重
  var r1 = 0;
  var r2 = 0;
  var r3 = 0;
  var r4 = 0;

  r1 = Math.pow((1 / (m - e)), (1 - e1));
  r2 = Math.pow((1 / (m - e)), (1 - e2));
  r3 = Math.pow((1 / (m - e)), (1 - e3));
  r4 = Math.pow((1 / (m - e)), (1 - e4));

  //计算正规化权重：即为各个因子之权重
  var b1 = 0;
  var b2 = 0;
  var b3 = 0;
  var b4 = 0;

  var r = r1 + r2 + r3 + r4;

  b1 = r1 / r;
  b2 = r2 / r;
  b3 = r3 / r;
  b4 = r4 / r;

  //各个专家的加权得分
  var s = 0;
  _.each(arr, function(o) {
    var tmpS = o.data.a * b1 + o.data.b * b2 + o.data.c * b3 + o.data.d * b4;
    s += tmpS;

    //各个专家的权重
    o.data.z = tmpS;
  })

  var s = s / m;

  console.log('--->>>灰色参数: ', 'w1: ', b1, ' w2: ', b2, ' w3: ', b3, ' w4: ', b4);

  //需要的数据
  //b2, b4, s;
  return {
    'b1': b1,
    'b2': b2,
    'b3': b3,
    'b4': b4,
    's': s,
  }
};


//灰色
//子任务模块
exports.graySubModule = function(arr) {
  //利用各个task的数据计算子任务的gray
  var n = arr.length;

  var res = 0;
  var total = 0;

  _.each(arr, function(o) {
    total += (o.b2 + o.b4);
  });

  _.each(arr, function(o) {
    var tmpRes = o.s * ((o.b2 + o.b4) / total);

    //任务单元的权重
    o.y = tmpRes;
    res += tmpRes;
  })

  return res;
};

//灰色
//任务模块
exports.grayModule = function(arr) {
  return _.sum(arr);
};


//Cooper
//任务单元
exports.cooperTask = function(arr) {
  var m = arr.length;

  //计算平均数,即任务单元得分
  var total = 0; //总分

  _.each(arr, function(o) {
    total += parseFloat(o.data.a);
  })

  console.log('------>>>>参数: ', 'total: ', total, 'm: ', m);
  var sch = total / m;

  return sch;
};

//Cooper
//子任务模块
//TODO
exports.cooperSubModule = function(arr) {
  var total = 0;    

  total = _.sum(arr);

  return total;
};

//Cooper
//任务模块 
//TODO
exports.cooperModule = function(arr) {
  var total = 0;    

  total = _.sum(arr);

  return total;
};
