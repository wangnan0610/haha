//一些公共方法和文件
//任务单元详细数据展示,返回html字符串
window.myUtil = {};

myUtil.formatTaskData = function(obj) {
  var str = '';
  str = '<table class="table table-bordered table-striped" >' +
    '<tbody>' +
    '<tr><td>任务单元</td><td><%= obj.text %></td></tr>' +
    '<tr><td>行为类型</td><td><%= obj.a %></td></tr>' +
    '<tr><td>允许作业人员进行相应的时间/s</td><td><%= obj.b %></td></tr>' +
    '<tr><td>作业人员一般情况下的执行时间/s</td><td><%= obj.c %></td></tr>' +
    '<tr><td>操作员经验</td><td><%= obj.d %></td></tr>' +
    '<tr><td>心理压力</td><td><%= obj.e %></td></tr>' +
    '<tr><td>人机界面</td><td><%= obj.f %></td></tr>' +
    '<tr><td>人误率</td><td><%= obj.therp %></td></tr>' +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);
}

myUtil.formatTaskDataGray = function(obj) {
  var str = '';

  //表1
  str += '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>任务单元</th><th>体力劳动强度</th><th>脑力劳动强度</th><th>体力作业复杂度</th><th>脑力作用复杂度</th></tr>' +
    '</thead>' +

    '<tbody>' +
    '<% _.each(obj.gd, function(val, index) { %> ' +
    '<tr><td>专家<%= val.file %></td><td><%= val.data.a %></td><td><%= val.data.b %></td><td><%= val.data.c %></td><td><%= val.data.d %></td></tr>' +
    '<% }) %>' +
    '</tbody>' +
    '</table>';

  //表2
  str += '<table class="table table-bordered table-striped" >' +
    '<tbody>' +
    '<tr><td>任务单元</td><td><%= obj.text %></td></tr>' +
    '<tr><td>体力劳动权重</td><td><%= obj.gray.b1 %></td></tr>' +
    '<tr><td>脑力劳动权重</td><td><%= obj.gray.b2 %></td></tr>' +
    '<tr><td>体力作业复杂度权重</td><td><%= obj.gray.b3 %></td></tr>' +
    '<tr><td>脑力作用复杂度权重</td><td><%= obj.gray.b4 %></td></tr>' +
    '</tbody>' +
    '</table>';

  //表3
  str += '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>任务单元</th><th>加权得分</th><th>最后得分</th></tr>' +
    '</thead>' +

    '<% _.each(obj.gd, function(val, index) { %> ' +
    '<% if (index === 0) { %>' +
    '<tr><td>专家<%= val.file %></td>' +
    '<td><%= val.data.z %></td>' +
    '<td rowspan=<%= obj.gd.length %>><%= obj.gray.s %></td></tr>' +
    '<% } else { %>' +
    '<tr><td>专家<%= val.file %></td>' +
    '<td><%= val.data.z %></td></tr>' +
    '<% } %>' +
    '<% }) %>' +

    '<tbody>' +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);
};

myUtil.formatTaskDataCooper = function(obj) {
  var str = '';

  str += '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>任务单元</th><th>Cooper-harper得分</th></tr>' +
    '</thead>' +

    '<tbody>' +
    '<% _.each(obj.gd, function(val, index) { %> ' +
    '<tr><td>专家<%= val.file %></td><td><%= val.data.a %></td></tr>' +
    '<% }) %>' +
    '</tbody>' +

    '<tfoot>' +
    '<tr><td>任务单元最后得分</td><td><%= obj.sch %></td></tr>'
    '</tfoot>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);
};

myUtil.formatSubData = function(obj) {
  var str = '';
  var tmp = '';

  tmp += '<% _.each(obj.children, function(val, index) { %> ' +
    '<% if (index === 0) { %>' +
    '<tr><td rowspan=<%= obj.children.length > 0 ? obj.children.length : 1 %>><%= obj.text %></td>' +
    '<td><%= obj.children[index].data.text %></td>' +
    '<td><%= obj.children[index].data.therp %></td>' +
    '<td rowspan=<%= obj.children.length > 0 ? obj.children.length :  1 %>><%= obj.therp %></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= obj.children[index].data.text %></td>' +
    '<td><%= obj.children[index].data.therp %></td></tr>' +
    '<% } %>' +
    '<% }) %>';
  str = '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>子任务模块</th><th>任务单元</th><th>任务单元人误率</th><th>子任务模块人误率</th></tr>' +
    '</thead>' +
    '<tbody>' +
    tmp +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);
}

myUtil.formatSubModuleDataGray = function(obj) {
  var str = '';
  var tmp = '';

  tmp += '<% _.each(obj.children, function(val, index) { %> ' +
    '<% if (index === 0) { %>' +
    '<tr><td rowspan=<%= obj.children.length > 0 ? obj.children.length : 1 %>><%= obj.text %></td>' +
    '<td><%= obj.children[index].data.text %></td>' +
    '<td><%= obj.children[index].data.gray.y %></td>' +
    '<td rowspan=<%= obj.children.length > 0 ? obj.children.length :  1 %>><%= obj.gray %></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= obj.children[index].data.text %></td>' +
    '<td><%= obj.children[index].data.gray.y %></td></tr>' +
    '<% } %>' +
    '<% }) %>';
  str = '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>子任务模块</th><th>任务单元</th><th>任务单元权重</th><th>子任务模块得分</th></tr>' +
    '</thead>' +
    '<tbody>' +
    tmp +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);

}

myUtil.formatSubModuleDataCooper = function(obj) {
  var str = '';
  var tmp = '';

  tmp += '<% _.each(obj.children, function(val, index) { %> ' +
    '<% if (index === 0) { %>' +
    '<tr><td rowspan=<%= obj.children.length > 0 ? obj.children.length : 1 %>><%= obj.text %></td>' +
    '<td><%= obj.children[index].data.text %></td>' +
    '<td><%= obj.children[index].data.sch %></td>' +
    '<td rowspan=<%= obj.children.length > 0 ? obj.children.length :  1 %>><%= obj.sch %></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= obj.children[index].data.text %></td>' +
    '<td><%= obj.children[index].data.sch %></td></tr>' +
    '<% } %>' +
    '<% }) %>';
  str = '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>子任务模块</th><th>任务单元</th><th>任务单元Cooper-harper得分</th><th>子任务模块Cooper-harper得分</th></tr>' +
    '</thead>' +
    '<tbody>' +
    tmp +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);

}

myUtil.formatModuleData = function(obj) {
  var str = '';
  var tmp = '';

  tmp += '<% _.each(obj.children, function(val, index) { %> ' +
    '<% _.each(val.children, function(v, k) { %>' +
    '<% if (index===0) {%>' +
    '<% if (k === 0) { %>' +
    '<tr><td rowspan=<%= obj.count %>><%= obj.text %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.text%></td>' +
    '<td><%= v.data.text %></td>' +
    '<td><%= v.data.therp %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.therp%></td>' +
    '<td rowspan=<%= obj.count %>><%= obj.therp %></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= v.data.text %></td>' +
    '<td><%= v.data.therp %></td></tr>' +
    '<% } %>' +
    '<% } else { %>' +
    '<% if (k === 0) { %>' +
    '<tr><td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.text%></td>' +
    '<td><%= v.data.text %></td>' +
    '<td><%= v.data.therp %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.therp%></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= v.data.text %></td>' +
    '<td><%= v.data.therp %></td></tr>' +
    '<% }%>' +
    '<% }%>' +
    '<% }) %>' +
    '<% }) %>';
  str = '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>任务模块</th><th>子任务模块</th><th>任务单元</th><th>任务单元人误率</th><th>子任务模块人误率</th><th>任务模块人误率</th></tr>' +
    '</thead>' +
    '<tbody>' +
    tmp +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);
}

myUtil.formatModuleDataGray = function(obj) {
  var str = '';
  var tmp = '';

  tmp += '<% _.each(obj.children, function(val, index) { %> ' +
    '<% _.each(val.children, function(v, k) { %>' +
    '<% if (index===0) {%>' +
    '<% if (k === 0) { %>' +
    '<tr><td rowspan=<%= obj.count %>><%= obj.text %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.text%></td>' +
    '<td><%= v.data.text %></td>' +
    '<td><%= v.data.gray.s %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.gray%></td>' +
    '<td rowspan=<%= obj.count %>><%= obj.gray %></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= v.data.text %></td>' +
    '<td><%= v.data.gray.s %></td></tr>' +
    '<% } %>' +
    '<% } else { %>' +
    '<% if (k === 0) { %>' +
    '<tr><td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.text%></td>' +
    '<td><%= v.data.text %></td>' +
    '<td><%= v.data.gray.s %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.gray%></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= v.data.text %></td>' +
    '<td><%= v.data.gray.s %></td></tr>' +
    '<% }%>' +
    '<% }%>' +
    '<% }) %>' +
    '<% }) %>';
  str = '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>任务模块</th><th>子任务模块</th><th>任务单元</th><th>任务单元得分</th><th>子任务模块得分</th><th>任务模块得分</th></tr>' +
    '</thead>' +
    '<tbody>' +
    tmp +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);

}

myUtil.formatModuleDataCooper = function(obj) {
  var str = '';
  var tmp = '';

  tmp += '<% _.each(obj.children, function(val, index) { %> ' +
    '<% _.each(val.children, function(v, k) { %>' +
    '<% if (index===0) {%>' +
    '<% if (k === 0) { %>' +
    '<tr><td rowspan=<%= obj.count %>><%= obj.text %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.text%></td>' +
    '<td><%= v.data.text %></td>' +
    '<td><%= v.data.sch %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.sch%></td>' +
    '<td rowspan=<%= obj.count %>><%= obj.sch %></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= v.data.text %></td>' +
    '<td><%= v.data.sch %></td></tr>' +
    '<% } %>' +
    '<% } else { %>' +
    '<% if (k === 0) { %>' +
    '<tr><td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.text%></td>' +
    '<td><%= v.data.text %></td>' +
    '<td><%= v.data.sch %></td>' +
    '<td rowspan=<%= val.children.length > 0 ?val.children.length : 1%>><%=val.data.sch%></td></tr>' +
    '<% } else { %>' +
    '<tr><td><%= v.data.text %></td>' +
    '<td><%= v.data.sch %></td></tr>' +
    '<% }%>' +
    '<% }%>' +
    '<% }) %>' +
    '<% }) %>';
  str = '<table class="table table-bordered table-striped" >' +
    '<thead>' +
    '<tr><th>任务模块</th><th>子任务模块</th><th>任务单元</th><th>任务单元Cooper-harper得分</th><th>子任务模块Cooper-harper得分</th><th>任务模块Cooper-harper得分</th></tr>' +
    '</thead>' +
    '<tbody>' +
    tmp +
    '</tbody>' +
    '</table>';

  var compiled = _.template(str);

  return compiled(obj);
}

myUtil.saveToExcel = function(ele) {

  $this = $(ele);
  var url = $this.attr('data-type');
  console.log('Save: ', url);
  console.log(JSON.stringify(window.jsTreeData));
  $.ajax({
    url: url,
    method: 'post',
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify(window.jsTreeData),
    success: function(data) {
      if (data.code == 200) {
        alert('保存成功');
      } else {
        alert('保存失败，请重新尝试或者联系管理员.');
        console.log(data.error);
      }
    },
    error: function(err) {
      alert('保存失败，请重新尝试或者联系管理员.');
      console.log(err);
    }
  })
}

//obj.id button id
//obj.url 保存的url
myUtil.addSaveButton = function(obj) {
  var str = '';
  str = '<button onclick="window.myUtil.saveToExcel(this)" type="button" class="btn btn-success pull-right" data-type=<%= obj.url %> id="save-excel-button">保存</button>';

  var compiled = _.template(str);

  return compiled(obj);
}
