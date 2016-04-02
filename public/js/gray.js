$(function() {
  //分为三种不同的展示界面
  console.log(window.jsTreeData);
  $('#gray-tree')
    .on('select_node.jstree', function(e, data) {
      var selectNode = data.node.data; //用来保存所选元素的数据
      $('#gray-result').empty();
      console.log(selectNode);

      if (selectNode.role === 1) { //任务模块
        $('#gray-result').append(window.myUtil.formatModuleDataGray(selectNode));
        $('#gray-result').append(window.myUtil.addSaveButton({
          url: '/gray/' + $('#excel-filename').text().trim(),
        }))
      } else if (selectNode.role === 2) { //子任务模块
        $('#gray-result').append(window.myUtil.formatSubModuleDataGray(selectNode));
      } else if (selectNode.role === 3) { //任务单元 
        $('#gray-result').append(window.myUtil.formatTaskDataGray(selectNode));
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
