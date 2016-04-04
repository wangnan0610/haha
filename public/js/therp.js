$(function() {
  //分为三种不同的展示界面
  var $showPanel = $('#right-result');
  $('#left-tree')
    .on('select_node.jstree', function(e, data) {
      var selectNode = data.node.data; //用来保存所选元素的数据
      $showPanel.empty();

      if (selectNode.role === 1) { //任务模块
        $showPanel.append(window.myUtil.formatModuleData(selectNode));
        $showPanel.append(window.myUtil.addSaveButton({
          url: '/therp/' + $('#task-name').text().trim(),
        }));
      } else if (selectNode.role === 2) { //子任务模块
        $showPanel.append(window.myUtil.formatSubData(selectNode));
      } else if (selectNode.role === 3) { //任务单元 
        $showPanel.append(window.myUtil.formatTaskData(selectNode));
      } else {
        console.error('有问题，role不对');
      }
    })
    .jstree({
      'core': {
        data: _.clone(window.jsTreeData)
      }
    });
});
