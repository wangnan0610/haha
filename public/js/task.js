$(function() {
  //右键菜单
  function customMenu($node) {
    //获取已建实例
    var tree = $("#task-tree").jstree(true);

    var items = {
      renameItem: { // The "rename" menu item
        "separator_before": true,
        "separator_after": true,
        "label": "重命名",
        "action": function(obj) {
          tree.edit($node);
        }
      },
      deleteItem: { // The "delete" menu item
        "separator_before": true,
        "separator_after": true,
        "label": "删除",
        "action": function() {
          tree.delete_node($node);
        }
      },
    };

    //分情况讨论
    if ($node.parent === '#') { //任务模块
      delete items.deleteItem;
      items.createSubItem = {
        "separator_before": true,
        "separator_after": true,
        "label": '添加子任务模块',
        "action": function() {
          $node = tree.create_node($node, ' 子任务模块');
          tree.edit($node);
        }
      }
    } else if ($node.parent === 'j1_1') { //子任务模块
      items.createItem = {
        "separator_before": true,
        "separator_after": true,
        "label": '添加子任务模块',
        "action": function() {
          $node = tree.create_node($node.parent, ' 子任务模块');
          tree.edit($node);
        }
      };
      items.createSubItem = {
        "separator_before": true,
        "separator_after": true,
        "label": '添加任务单元',
        "action": function() {
          $node = tree.create_node($node, ' 任务单元');
          tree.edit($node);
        }
      }
    } else { // 任务单元
      items.createSubItem = {
        "separator_before": true,
        "separator_after": true,
        "label": '添加任务单元',
        "action": function() {
          $node = tree.create_node($node.parent, ' 任务单元');
          tree.edit($node);
        }
      }
    }

    return items;
  }

  //jstree 初始化
  $('#task-tree')
    .on('create_node.jstree rename_node.jstree delete_node.jstree', function(e, data) {
      store.set('jstree_data', $(this).jstree(true).get_json('#', {
        no_children: false,
        no_state: true,
        no_id: true,
        no_data: true
      }));
    })
    .jstree({
      "core": {
        "check_callback": true,
        "themes": {
          "stripes": true,
        },
        'data': function(obj, callback) {
          if (store.get('jstree_data')) {
            callback.call(this, store.get('jstree_data'));
          } else {
            callback.call(this, ['任务模块']);
          }
        },
      },
      "plugins": [
        "contextmenu"
      ],
      "contextmenu": {
        "items": customMenu
      }
    });

  //清除缓存
  $('#task-clear').on('click', function() {
    store.clear();
    window.location.reload();
  });

  //提交
  $('#task-submit').on('click', function() {
    var obj = $('#task-tree').jstree(true).get_json('#', {
      no_children: false,
      no_state: true,
      no_id: false,
      no_data: true,
      flat: true
    });

    var data = {
      data: JSON.stringify(obj)
    };

    $.ajax({
      url: '/task/create',
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function(data) {
        $('#task-submit-modal').modal('hide');
        if (data.code == 200) {
          //提交成功      
          //确认是否需要生成调研表
          $('#task-survey-modal').modal('show');
          $('#task-survey-modal').data('task', data.task);
          $('#task-survey-modal').data('ws', data.ws);
        } else {
          alert('提交失败，请重新尝试或者联系管理员~');
        }
      },
      error: function(e) {
        console.error(JSON.stringify(e));
        $('#task-submit-modal').modal('hide');
        alert('提交失败，请重新尝试或者联系管理员~');
      }
    })
  });

  //生成调研表
  $('#task-survey-submit').on('click', function() {
    var obj = $('#task-tree').jstree(true).get_json('#', {
      no_children: false,
      no_state: true,
      no_id: false,
      no_data: true,
      flat: true
    });
    $.ajax({
      type: 'post',
      url: '/task/survey/create',
      dataType: 'json',
      data: {
        task: $('#task-survey-modal').data('task'),
        data: JSON.stringify(obj)
      },
      success: function(data) {
        $('#task-survey-modal').modal('hide');
        if (data.code == 200) {
          //提交成功      
          store.clear();
          setTimeout(function() {
            window.location.reload();
          }, 500);
        } else {
          alert('生成调研表失败，请重新尝试或者联系管理员~');
        }
      },
      error: function(e) {
        $('#task-survey-modal').modal('hide');
        console.error(JSON.stringify(e.stack));
        alert('生成调研表失败，请重新尝试或者联系管理员!');
      }
    })
  })




})
