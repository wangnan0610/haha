$(function() {
  //右键菜单
  function customMenu(node) {
    console.log(node);
    var items = {
      renameItem: { // The "rename" menu item
        label: "重命名",
        action: function() {
        }
      },
      deleteItem: { // The "delete" menu item
        label: "删除",
        action: function() {
        }
      }
    };
    if ($(node).hasClass("folder")) {
      // Delete the "delete" menu item
      delete items.deleteItem;
    }
    return items;
  }
  $('#task-tree').jstree({
    "core": {
      "check_callback": true,
      "themes": {
        "stripes": true,
      },
      'data': [
        '任务模块',
      ]
    },
    "plugins": [
      "contextmenu"
    ],
    "contextmenu": {
      "items": customMenu
    }
  });
  $('#task-tree').on("changed.jstree", function(e, data) {
    console.log(data.selected);
  });
})
