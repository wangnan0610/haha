$(function() {
  //分为三种不同的展示界面
  console.log(window.jsTreeData);
  $('#gray-tree')
    .on('select_node.jstree', function(e, data) {
      var selectNode = data.node.data; //用来保存所选元素的数据
      $('#gray-result').empty();

      if (selectNode.role === 1) { //任务模块
      } else if (selectNode.role === 2) { //子任务模块
      } else if (selectNode.role === 3) { //任务单元 
      } else {
        console.error('有问题，role不对');
      }
    })
    .jstree({
      'core': {
        data: window.jsTreeData
      }
    });
});
