/*
@Name：《昱杰后台UI框架》
@Author：风形火影
@Site：https://www.yjrj.top
*/
$(function () {
  // 图片插入配置
  let uploadConfig = {
    server: CONFIG['UPLOAD_SERVER'],
    uploadDir: CONFIG['UPLOAD_DIR'],
    auto: true,
    fileSingleSizeLimit: 10240000,
    threads: 1,
    accept: {
      extensions: 'bmp,gif,jpg,jpeg,png',
      mimeTypes: '.bmp,.gif,.jpg,.jpeg,.png'
    },
    compress: false,
    resize: false,
    duplicate: true
  };
  let galleryConfig = {
    pictureDir: CONFIG['PICTURE_DIR'],
    pictureList: CONFIG['PICTURE_LIST'],
    uploadDir: CONFIG['UPLOAD_DIR']
  };

  // 图片单选
  let pickerId1 = '.picture_picker1';
  if ($(pickerId1).length) {
    let input = 'input[name=picture1]';
    let gallery = new Gallery({
      pick: {
        id: pickerId1,
        label: '本地上传',
        multiple: false
      },
      uploadConfig: uploadConfig,
      input: input
    });
    $('.picture_choose1').on('click', function () {
      galleryConfig.multiple = false;
      galleryConfig.input = input;
      galleryConfig.id = pickerId1;
      gallery.dialog(galleryConfig);
    });
  }

  // 图片多选
  let pickerId2 = '.picture_picker2';
  if ($(pickerId2).length) {
    let input = 'input[name=picture2]';
    let gallery = new Gallery({
      pick: {
        id: pickerId2,
        label: '本地上传'
      },
      uploadConfig: uploadConfig,
      input: input,
      beforeCallback: function (value) {
        if (value.length >= 6) {
          alert('最多只能插入6张图片');
          return false;
        }
      },
      insertCallback: callback,
      dragCallback: callback,
      deleteCallback: callback
    });
    $('.picture_choose2').on('click', function () {
      galleryConfig.multiple = true;
      galleryConfig.input = input;
      galleryConfig.id = pickerId2;
      galleryConfig.beforeCallback = function (value) {
        if (value.length > 6) {
          alert('最多只能插入6张图片');
          return false;
        }
      };
      galleryConfig.insertCallback = callback;
      gallery.dialog(galleryConfig);
    });
  }
  function callback (value) {
    $.each(value, function (index, v) {
      // console.log(v);
    });
  }

  // 编辑器插入图片
  let pickerId3 = '.picture_picker3';
  if ($(pickerId3).length) {
    let gallery = new Gallery({
      pick: {
        id: pickerId3,
        label: '本地上传'
      },
      text: true,
      input: '',
      uploadConfig: uploadConfig,
      beforeCallback: function () {
        if (CKEDITOR.instances['TextArea1'].mode !== 'wysiwyg') {
          alert('请在设计模式下插入图片');
          return false;
        }
      },
      insertCallback: function (value) {
        CKEDITOR.instances['TextArea1'].insertHtml('<img alt="图片" src="' + CONFIG['UPLOAD_DIR'] + value + '" />');
      }
    });
    $('.picture_choose3').on('click', function () {
      galleryConfig.multiple = true;
      galleryConfig.text = true;
      galleryConfig.id = pickerId3;
      galleryConfig.beforeCallback = function () {
        if (CKEDITOR.instances['TextArea1'].mode !== 'wysiwyg') {
          alert('请在设计模式下插入图片');
          return false;
        }
      };
      galleryConfig.insertCallback = function (value) {
        if (value) {
          $.each(value, function (i, v) {
            CKEDITOR.instances['TextArea1'].insertHtml('<img alt="图片" src="' + CONFIG['UPLOAD_DIR'] + v + '" />');
          });
        }
      };
      gallery.dialog(galleryConfig);
    });
  }
});
