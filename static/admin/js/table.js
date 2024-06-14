/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.cn
*/
$(function () {
  let moduleName = '表格';

  // 列表
  list(moduleName);
});

function listItem (item) {
  let control = [];
  control.push('<a href="javascript:" class="update">修改</a>');
  control.push('<a href="javascript:" class="delete">删除</a>');
  return '<tr class="item' + item['id'] + '"><td><div class="check-box"><label><input type="checkbox" name="id" value="' + item['id'] + '"></label></div></td><td>' + item['row1'] + '</td><td>' + item['row2'] + '</td><td>' + item['row3'] + '</td><td>' + item['row4'] + '</td><td>' + item['row5'] + '</td> <td>' + item['row6'] + '</td>' + (control.length ? '<td>' + control.join('/') + '</td>' : '') + '</tr>';
}
