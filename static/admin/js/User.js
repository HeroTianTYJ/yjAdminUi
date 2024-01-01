$(function () {
  let $list = $('.list');
  let moduleName = '用户';

  // 列表
  list(moduleName);

  // 添加
  add('添加' + moduleName);

  // 修改
  update('修改' + moduleName);

  // 删除
  remove(moduleName);

  // 批量删除
  multiRemove(moduleName);

  // 解绑微信
  $list.on('click', 'a.wechat_open_id', function () {
    let that = this;
    confirmLayer(
      CONFIG['UNBIND_WECHAT'],
      {id: $(that).parent().parent().find('input[name=id]').val()},
      '<h3><span>？</span>确定要为该用户解绑微信吗？</h3><p>解绑后，该用户需要重新绑定微信。</p>',
      function (json, layerIndex) {
        if (json['state'] === 1) {
          layer.close(layerIndex);
          $(that).parent().html('<span class="green">否</span>');
        }
      }
    );
  });

  // 解绑QQ
  $list.on('click', 'a.qq_open_id', function () {
    let that = this;
    confirmLayer(
      CONFIG['UNBIND_QQ'],
      {id: $(that).parent().parent().find('input[name=id]').val()},
      '<h3><span>？</span>确定要为该用户解绑QQ吗？</h3><p>解绑后，该用户需要重新绑定QQ。</p>',
      function (json, layerIndex) {
        if (json['state'] === 1) {
          layer.close(layerIndex);
          $(that).parent().html('<span class="green">否</span>');
        }
      }
    );
  });

  // 搜索
  layui.use(['form', 'date'], function () {
    // 用户等级
    layui.form.on('select(user_level_id)', function (data) {
      window.location.href = searchUrl('user_level_id=' + data.value);
    });
    // 微信绑定
    layui.form.on('select(wechat)', function (data) {
      window.location.href = searchUrl('wechat=' + data.value);
    });
    // QQ绑定
    layui.form.on('select(qq)', function (data) {
      window.location.href = searchUrl('qq=' + data.value);
    });
    // 注册时间
    layui.date.render({
      elem: 'input[name=date1]',
      done: function (value) {
        window.location.href = searchUrl('date1=' + value);
      }
    });
    layui.date.render({
      elem: 'input[name=date2]',
      done: function (value) {
        window.location.href = searchUrl('date2=' + value);
      }
    });
  });
});

function listItem (item) {
  let control = [];
  control.push('<a href="javascript:" class="update">修改</a>');
  control.push('<a href="javascript:" class="delete">删除</a>');
  return '<tr class="item' + item['id'] + '"><td><div class="check-box"><label><input type="checkbox" name="id" value="' + item['id'] + '"></label></div></td><td>' + item['name'] + '</td><td>' + item['email'] + '</td><td>' + item['user_level'] + '</td><td>' + (item['wechat_open_id'] ? '<span class="red">是</span> | <a href="javascript:" class="wechat_open_id">解绑</a>' : '<span class="green">否</span>') + '</td><td>' + (item['qq_open_id'] ? '<span class="red">是</span> | <a href="javascript:" class="qq_open_id">解绑</a>' : '<span class="green">否</span>') + '</td><td>' + item['date'] + '</td>' + (control.length ? '<td>' + control.join('/') + '</td>' : '') + '</tr>';
}
