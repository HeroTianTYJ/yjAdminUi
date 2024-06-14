/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.cn
*/
$(function () {
  $('.login').Validform({
    tiptype: function (msg) {
      tip(msg);
    },
    showAllError: false,
    dragonfly: true,
    tipSweep: true,
    ajaxPost: true,
    callback: function (data) {
      let json = JSON.parse(data);
      if (json['state'] === 0) {
        tip(json['content']);
      } else if (json['state'] === 1) {
        window.location.href = '../index/';
      }
    }
  }).addRule([{
    ele: 'input[name=name]',
    datatype: /^[\w\W]{1,20}$/,
    nullmsg: '请填写账号！',
    errormsg: '账号不得大于20位！'
  }, {
    ele: 'input[name=pass]',
    datatype: '*',
    nullmsg: '请填写密码！'
  }]);

  function tip (tip) {
    if (tip === '通过信息验证！' || tip === '正在提交数据…') return;
    let $tip = $('.tip');
    $tip.html(tip);
    setTimeout(function () {
      $tip.html('');
    }, 3000);
  }
});
