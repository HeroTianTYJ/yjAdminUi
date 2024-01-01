/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.top
*/
$(function () {
  // 成功提示
  $('.success').on('click', function () {
    showTip('这是一条成功提示', 1);
  });
  // 失败提示
  $('.failed').on('click', function () {
    showTip('这是一条失败提示', 0);
  });
  // 信息提示
  $('.info').on('click', function () {
    showTip('这是一条信息提示', 3);
  });
  // 警告提示
  $('.warning').on('click', function () {
    showTip('这是一条警告提示', 4);
  });
});
