$(function() {
  $('#therp-tree')
    .on('select_node.jstree', function(e, data) {
      console.log(data.node.data)
    })
    .jstree({
      'core': {
        data: window.therpJsTree
      }
    });
});
