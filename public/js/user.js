$(function() {
  $('#userModal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var opt = button.data('opt');
    //两种行为
    var modal = $(this);
    switch (opt) {
      case 'add': 
        modal.find('.modal-title').text('新增用户');
        break;
      case 'update': 
        modal.find('.modal-title').text('编辑用户');
        break;
    }
  })

  $('.operation').on('click', function() {
    var data = JSON.parse($(this).attr('data'));
    var confirm = window.confirm('确认要更改吗？');

    if (confirm) {
      $.ajax({
        url: '/admin/user',
        method: 'POST',
        type: 'JSON',
        data: {
          id: data._id,
          status: (data.status === 'wait' || data.status === 'fail') ? 'pass' : 'fail'
        },
        success: function() {
          window.location.reload();
        },
        error: function() {
          alert('请重新尝试或者联系管理员');
        }
      })
    }
  })
})
