/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.top
*/
$(function () {
  let moduleName = '';

  if (CONFIG['TYPE'] === 'directory') {
    moduleName = '图片目录';

    // 删除
    remove(moduleName);
  } else if (CONFIG['TYPE'] === 'picture') {
    moduleName = '图片';

    // 清理冗余
    $('.group .clear_picture').on('click', function () {
      confirmLayer(
        CONFIG['CLEAR_PICTURE'],
        {id: CONFIG['ID']},
        '<h3><span>？</span>确定要清理冗余图片吗？</h3><p>清理冗余图片之后，无法进行恢复。</p>',
        function (json, layerIndex) {
          if (json['state'] === 1) {
            layer.close(layerIndex);
            setTimeout(function () {
              window.location.reload(true);
            }, 3000);
          }
        }
      );
    });
  }

  // 列表
  list(moduleName);

  // 搜索
  // 关键词
  searchKeyword();
});

function listItem (item) {
  let html = '';
  if (CONFIG['TYPE'] === 'directory') {
    let control = [];
    control.push('<a href="' + CONFIG['PICTURE'] + '?id=' + item['id'] + '">进入目录</a>');
    if (parseInt(item['total1']) === 0) control.push('<a href="javascript:" class="delete">删除</a>');
    html = '<tr class="item' + item['id'] + '"><td class="none"><div class="check-box"><label><input type="checkbox" name="id" value="' + item['id'] + '"></label></div></td><td>' + item['name'] + '</td><td>' + item['total1'] + '张</td><td>' + item['total2'] + '张</td><td>' + item['total3'] + '张</td>' + (control.length ? '<td>' + control.join('/') + '</td>' : '') + '</tr>';
  } else if (CONFIG['TYPE'] === 'picture') {
    html = '<li><dl><dd><img src="' + (CONFIG['PICTURE_TYPE'] === '2' ? '../../static/yj.admin.ui/images/cleaned_picture.png' : CONFIG['DIR_UPLOAD'] + CONFIG['ID'] + '/' + item['id']) + '" alt="' + item['id'] + '"></dd><dt>' + item['name'] + '</dt></dl></li>';
  }
  return html;
}
