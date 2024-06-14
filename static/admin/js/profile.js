/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.cn
*/
$(function () {
  let $form = $('.form');
  if ($form.length) {
    // 提交修改
    $form.on('submit', function (e) {
      $.ajax({
        type: 'POST',
        url: CONFIG['PROFILE'],
        async: false,
        data: $(this).serialize(),
        success: function (data) {
          let json = JSON.parse(data);
          showTip(json['content'], json['state']);
          e.preventDefault();
        }
      });
    });
  } else {
    let moduleName = '登录记录';
    // 列表
    list(moduleName);
  }
});

function listItem (item) {
  return '<tr class="item' + item['id'] + '"><td>' + item['ip'] + '</td><td>' + item['date'] + '</td></tr>';
}
