$(function () {
  // tab切换
  let $tabLi = $('.tab li');
  let $column = $('.form .column');
  $tabLi.on('click', function () {
    $tabLi.removeClass('active');
    $(this).addClass('active');
    $column.addClass('none');
    $column.eq($(this).index()).removeClass('none');
    screenAuto();

    if ($(this).index() === 2 && $('.CodeMirror').length === 0) {
      code();
    }
  });

  // 复选下拉框
  let $multiSelect = $('input[name=multi_select]');
  $.ajax({
    type: 'POST',
    url: CONFIG['MULTI_SELECT']
  }).then(function (data) {
    xmSelect.render({
      el: '.multi_select',
      data: JSON.parse(data),
      toolbar: {
        show: true
      },
      theme: {
        color: '#0059FF',
        hover: '#E4EBFF'
      },
      filterable: true,
      autoRow: true,
      on: function (data) {
        let ids = '';
        $.each(data.arr, function (index, value) {
          ids += value.value + ',';
        });
        $multiSelect.val(ids.substring(0, ids.length - 1));
      }
    });
  });

  layui.use(['date'], function () {
    // 日期选择器
    layui.date.render({
      elem: '.date'
    });
    // 时间选择器
    layui.date.render({
      type: 'datetime',
      elem: '.datetime'
    });
  });

  // 颜色选择器
  $('.colorpicker').colorpicker();

  // 数字调节器
  $('div.number').number({
    width: 150,
    height: 31,
    top: 5,
    min: 0
  });

  // 商品评分
  let $score = $('input[name=score]');
  let $scoreTitle = $('.score_title');
  $('.score').raty({
    score: 5,
    starType: 'span',
    starOff: 'iconfont color icon-star',
    starOn: 'iconfont color icon-star-whole',
    hints: ['非常差', '差', '一般', '好', '非常好'],
    click: function (score, event) {
      $score.val(score);
      $scoreTitle.html(event.target.title);
    }
  });

  // 代码编辑器
  function code () {
    let $code = $('.code');
    let editor = CodeMirror.fromTextArea($code.get(0), {
      lineNumbers: true,
      mode: 'text/css',
      matchBrackets: true,
      lineWrapping: true
    });
    editor.on('blur', function () {
      $code.val(editor.getValue());
    });
  }
});
