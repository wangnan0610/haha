$(function() {
  //分为三种不同的展示界面
  var $showPanel = $('#right-result');
  $('#left-tree')
    .on('select_node.jstree', function(e, data) {
      var selectNode = data.node.data; //用来保存所选元素的数据
      $showPanel.empty();
      console.log(selectNode);

      if (selectNode.role === 1) { //任务模块
        $showPanel.append(window.myUtil.formatModuleDataCooper(selectNode));
        $showPanel.append(window.myUtil.addSaveButton({
          url: '/cooper/' + $('#task-name').text().trim(),
        }))
      } else if (selectNode.role === 2) { //子任务模块
        $showPanel.append(window.myUtil.formatSubModuleDataCooper(selectNode));
      } else if (selectNode.role === 3) { //任务单元 
        $showPanel.append(window.myUtil.formatTaskDataCooper(selectNode));
      } else {
        console.error('有问题，role不对');
      }
    })
    .jstree({
      'core': {
        data: _.cloneDeep(window.jsTreeData)
      }
    });
});
