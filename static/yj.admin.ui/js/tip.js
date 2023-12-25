$(function () {
  let $tip = $('.tip');
  $tip.find('.iconfont').addClass('icon-tip-' + CONFIG['TYPE']);
  $tip.find('.tip_content').html(CONFIG['TIP_CONTENT']);
  if (CONFIG['LOCATION_URL']) {
    $tip.find('.location a').attr({href: CONFIG['LOCATION_URL']});
    setTimeout(function () {
      window.location.href = CONFIG['LOCATION_URL'];
    }, CONFIG['SECOND'] * 1000);
  } else if (CONFIG['TYPE'] === 'failed') {
    $tip.find('.location a').attr({href: 'javascript:history.go(-1)'});
    setTimeout(function () {
      window.history.go(-1);
    }, CONFIG['SECOND'] * 1000);
  }
  if (CONFIG['LOCATION_CONTENT']) {
    $tip.find('.location a').text(CONFIG['LOCATION_CONTENT']);
  }
});
