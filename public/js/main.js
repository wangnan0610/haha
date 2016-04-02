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

myUtil.saveToExcel = function(ele) {

  $this = $(ele);
  var url = $this.attr('data-type');
  console.log('Save: ', url);
  $.ajax({
    url: url,
    method: 'get',
    dataType: 'json',
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
  str = '<button onclick="window.myUtil.saveToExcel(this)" type="button" class="btn btn-success pull-right" data-type=<%= obj.url %> id=<%= obj.id %>>保存</button>';

  var compiled = _.template(str);

  return compiled(obj);
}
