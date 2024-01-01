/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.top
*/
$(function () {
  // 普通弹窗
  $('.layer').on('click', function () {
    layer.confirm(
      '弹窗内容，支持html+css，开发者可自定义内容和样式',
      {
        title: '普通弹窗',
        area: '800px',
        resizable: false
      },
      function (index) {
        showTip('点击弹窗的确定按钮，并关闭了弹窗');
        layer.close(index);
      }
    );
  });

  // 确认弹窗
  $('.confirm').on('click', function () {
    confirmLayer(
      CONFIG['DELETE'],
      {id: 1}, // 根据需求向后端传递的参数
      '<h3><span>？</span>确认要删除此订单吗？</h3><p>删除此订单之后，无法进行恢复，可以重新添加。</p>',
      function (json, index) {
        if (json['state'] === 1) {
          layer.close(index);
        }
      }
    );
  });

  // ajax弹窗
  $('.ajax').on('click', function () {
    ajaxMessageLayer(
      CONFIG['AJAX'],
      'ajax弹窗',
      {id: 1}, // 根据需求向后端传递的参数
      function (index) {
        $.ajax({
          type: 'POST',
          url: CONFIG['AJAX_DO'],
          data: {id: 1} // 根据需求向后端传递的参数
        }).then(function (data) {
          let json = JSON.parse(data);
          showTip(json['content'], json['state']);
          if (json['state'] === 1) {
            layer.close(index);
          }
        });
      });
  });

  // 表单弹窗
  $('.form_layer').on('click', function () {
    ajaxMessageLayer(
      CONFIG['FORM'],
      '表单弹窗',
      {},
      function (index) {
        $.ajax({
          type: 'POST',
          url: CONFIG['FORM_DO'],
          data: $('form.form').serialize()
        }).then(function (data) {
          let json = JSON.parse(data);
          showTip(json['content'], json['state']);
          if (json['state'] === 1) {
            layer.close(index);
          }
        });
      }, function () {
        layui.use(['form'], function () {
          layui.form.render('select');
        });
        iCheck();
        $('.layui-layer-content').animate({scrollTop: 0});
      }, 800);
  });
});
