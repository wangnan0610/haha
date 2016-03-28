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

  var result = Math.exp(-Math.pow((t1/t2 - paramObj.c) / paramObj.a, paramObj.b));

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

