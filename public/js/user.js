$(function() {
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
