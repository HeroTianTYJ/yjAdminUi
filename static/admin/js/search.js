/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.cn
*/
$(function () {
  // 搜索
  // 关键词
  searchKeyword();
  layui.use(['form', 'date'], function () {
    // 下拉框
    layui.form.on('select(select_id)', function (data) {
      window.location.href = searchUrl('select_id=' + data.value);
    });
    // 时间
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
