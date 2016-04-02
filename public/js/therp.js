$(function() {
  //分为三种不同的展示界面
  $('#therp-tree')
    .on('select_node.jstree', function(e, data) {
      var selectNode = data.node.data; //用来保存所选元素的数据
      $('#therp-result').empty();

      if (selectNode.role === 1) { //任务模块
        $('#therp-result').append(window.myUtil.formatModuleData(selectNode));
        $('#therp-result').append(window.myUtil.addSaveButton({
          id: 'therp-save-button',
          url: '/therp/save/' + $('#therp-filename').text().trim() + '.xlsx',
        }));
      } else if (selectNode.role === 2) { //子任务模块
        $('#therp-result').append(window.myUtil.formatSubData(selectNode));
      } else if (selectNode.role === 3) { //任务单元 
        $('#therp-result').append(window.myUtil.formatTaskData(selectNode));
      } else {
        console.error('有问题，role不对');
      }
    })
    .jstree({
      'core': {
        data: window.therpJsTree
      }
    });
});
