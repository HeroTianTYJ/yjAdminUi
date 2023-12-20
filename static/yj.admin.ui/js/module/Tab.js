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
  });
});
