/*
Raty - A Star Rating Plugin
The MIT License
author:  Washington Botelho
github:  wbotelhos/raty
version: 3.0.0
*/

(function (root, factory) {
  factory(root.jQuery);
}(this, function ($) {
  'use strict';

  $.raty = {
    cancelButton: false,
    cancelClass: 'raty-cancel',
    cancelHint: 'Cancel this rating!',
    cancelOff: 'cancel-off.png',
    cancelOn: 'cancel-on.png',
    cancelPlace: 'left',
    click: undefined,
    half: false,
    halfShow: true,
    hints: ['bad', 'poor', 'regular', 'good', 'gorgeous'],
    iconRange: undefined,
    mouseout: undefined,
    mouseover: undefined,
    noRatedMsg: 'Not rated yet!',
    number: 5,
    numberMax: 20,
    path: undefined,
    precision: false,
    readOnly: false,
    round: {down: 0.25, full: 0.6, up: 0.76},
    score: undefined,
    scoreName: 'score',
    single: false,
    space: true,
    starHalf: 'star-half.png',
    starOff: 'star-off.png',
    starOn: 'star-on.png',
    starType: 'img',
    target: undefined,
    targetFormat: '{score}',
    targetKeep: false,
    targetScore: undefined,
    targetText: '',
    targetType: 'hint'
  };

  $.fn.raty = function (options) {
    return this.each(function () {
      return new $.raty.Raty(this, options)._create();
    });
  };
  $.raty.Raty = (function () {
    let Raty = function (element, options) {
      this.element = element;
      this.self = $(element);
      this.opt = $.extend(true, {}, $.raty, options, this.self.data());
    };
    Raty.prototype = {
      _create: function () {
        this._executeCallbacks();
        this._adjustNumber();
        this._adjustHints();
        this.opt.score = this._adjustedScore(this.opt.score);
        if (this.opt.starType !== 'img') {
          this._adjustStarName();
        }
        this._setPath();
        this._createStars();
        if (this.opt.cancelButton) this._createCancel();
        if (this.opt.precision) this._adjustPrecision();
        this._createScore();
        this._apply(this.opt.score);
        this._setTitle(this.opt.score);
        this._target(this.opt.score);
        if (this.opt.readOnly) {
          this._lock();
        } else {
          this.element.style.cursor = '';
          this._binds();
        }
        this.self.data('raty', this);
      },
      _adjustedScore: function (score) {
        if (score || score === 0) {
          return this._between(score, 0, this.opt.number);
        }
      },
      _adjustHints: function () {
        if (!this.opt.hints) this.opt.hints = [];
        if (!this.opt.halfShow && !this.opt.half) return;
        let steps = this.opt.precision ? 10 : 2;
        for (let i = 0; i < this.opt.number; i++) {
          let group = this.opt.hints[i];
          if (Object.prototype.toString.call(group) !== '[object Array]') group = [group];
          this.opt.hints[i] = [];
          for (let j = 0; j < steps; j++) {
            let hint = group[j];
            let last = group[group.length - 1];
            if (last === undefined) last = null;
            this.opt.hints[i][j] = hint === undefined ? last : hint;
          }
        }
      },
      _adjustNumber: function () {
        this.opt.number = this._between(this.opt.number, 1, this.opt.numberMax);
      },
      _adjustPrecision: function () {
        this.opt.half = true;
      },
      _adjustStarName: function () {
        let replaces = ['cancelOff', 'cancelOn', 'starHalf', 'starOff', 'starOn'];
        this.opt.path = '';
        for (let i = 0; i < replaces.length; i++) {
          this.opt[replaces[i]] = this.opt[replaces[i]].replace('.', '-');
        }
      },
      _apply: function (score) {
        this._fill(score);
        if (score) {
          if (score > 0) this.scoreField.val(score);
          this._roundStars(score);
        }
      },
      _attributesForIndex: function (i) {
        let name = this._nameForIndex(i);
        let attributes = {alt: i, src: this.opt.path + this.opt[name]};
        if (this.opt.starType !== 'img') attributes = {'data-alt': i, 'class': this.opt[name], 'style': 'cursor:pointer;'};
        attributes.title = this._getHint(i);
        return attributes;
      },
      _between: function (value, min, max) {
        return Math.min(Math.max(parseFloat(value), min), max);
      },
      _binds: function () {
        if (this.cancelButton) {
          this._bindOverCancel();
          this._bindClickCancel();
          this._bindOutCancel();
        }
        this._bindOver();
        this._bindClick();
        this._bindOut();
      },
      _bindClick: function () {
        let that = this;
        this.stars.on('click.raty', function (evt) {
          if (that.self.data('readonly')) return;
          let execute = true;
          let score = (that.opt.half || that.opt.precision) ? that.self.data('score') : (this.alt || $(this).data('alt'));
          if (that.opt.half && !that.opt.precision) score = that._roundHalfScore(score);
          if (that.opt.click) execute = that.opt.click.call(that.element, +score, evt);
          if (execute || execute === undefined) that._apply(+score);
        });
      },
      _bindClickCancel: function () {
        this.cancelButton.on('click.raty', function (evt) {
          this.scoreField.removeAttr('value');
          if (this.opt.click) this.opt.click.call(this.element, null, evt);
        }.bind(this));
      },
      _bindOut: function () {
        this.self.on('mouseleave.raty', function (evt) {
          let score = +this.scoreField.val() || undefined;
          this._apply(score);
          this._target(score, evt);
          this._resetTitle();
          if (this.opt.mouseout) this.opt.mouseout.call(this.element, score, evt);
        }.bind(this));
      },
      _bindOutCancel: function () {
        let that = this;
        this.cancelButton.on('mouseleave.raty', function (evt) {
          let icon = that.opt.cancelOff;
          if (that.opt.starType !== 'img') icon = that.opt.cancelClass + ' ' + icon;
          that._setIcon(this, icon);
          if (that.opt.mouseout) {
            let score = +that.scoreField.val() || undefined;
            that.opt.mouseout.call(that.element, score, evt);
          }
        });
      },
      _bindOver: function () {
        let that = this;
        let action = that.opt.half ? 'mousemove.raty' : 'mouseover.raty';
        this.stars.on(action, function (evt) {
          let score = that._getScoreByPosition(evt, this);
          that._fill(score);
          if (that.opt.half) {
            that._roundStars(score, evt);
            that._setTitle(score, evt);
            that.self.data('score', score);
          }
          that._target(score, evt);
          if (that.opt.mouseover) that.opt.mouseover.call(that.element, score, evt);
        });
      },
      _bindOverCancel: function () {
        let that = this;
        this.cancelButton.on('mouseover.raty', function (evt) {
          if (that.self.data('readonly')) return;
          let starOff = that.opt.path + that.opt.starOff;
          let icon = that.opt.cancelOn;
          if (that.opt.starType === 'img') {
            that.stars.attr('src', starOff);
          } else {
            icon = that.opt.cancelClass + ' ' + icon;
            that.stars.attr('class', starOff);
          }
          that._setIcon(this, icon);
          that._target(null, evt);
          if (that.opt.mouseover) that.opt.mouseover.call(that.element, null);
        });
      },
      _buildScoreField: function () {
        return $('<input />', {name: this.opt.scoreName, type: 'hidden'}).appendTo(this.self);
      },
      _createCancel: function () {
        let icon = this.opt.path + this.opt.cancelOff;
        let button = $('<' + this.opt.starType + ' />', { title: this.opt.cancelHint, 'class': this.opt.cancelClass });
        this.opt.starType === 'img' ? button.attr({ src: icon, alt: 'x' }) : button.attr('data-alt', 'x').addClass(icon);
        this.opt.cancelPlace === 'left' ? this.self.prepend('&#160;').prepend(button) : this.self.append('&#160;').append(button);
        this.cancelButton = button;
      },
      _createScore: function () {
        let score = $(this.opt.targetScore);
        this.scoreField = score.length ? score : this._buildScoreField();
      },
      _createStars: function () {
        for (let i = 1; i <= this.opt.number; i++) {
          let attributes = this._attributesForIndex(i);
          $('<' + this.opt.starType + ' />', attributes).appendTo(this.element);
          if (this.opt.space && i < this.opt.number) this.self.append('&#160;');
        }
        this.stars = this.self.children(this.opt.starType);
      },
      _error: function (message) {
        $(this).text(message);
        $.error(message);
      },
      _executeCallbacks: function () {
        let options = ['number', 'readOnly', 'score', 'scoreName', 'target', 'path'];
        for (let i = 0; i < options.length; i++) {
          if (typeof this.opt[options[i]] === 'function') {
            let value = this.opt[options[i]].call(this.element);
            value ? this.opt[options[i]] = value : delete this.opt[options[i]];
          }
        }
      },
      _fill: function (score) {
        let hash = 0;
        for (let i = 1; i <= this.stars.length; i++) {
          let icon;
          let star = this.stars[i - 1];
          let turnOn = this._turnOn(i, score);
          if (this.opt.iconRange && this.opt.iconRange.length > hash) {
            let iRange = this.opt.iconRange[hash];
            icon = this._getRangeIcon(iRange, turnOn);
            if (i <= iRange.range) this._setIcon(star, icon);
            if (i === iRange.range) hash++;
          } else {
            icon = this.opt[turnOn ? 'starOn' : 'starOff'];
            this._setIcon(star, icon);
          }
        }
      },
      _getDecimal: function (number, fractions) {
        let decimal = number.toString().split('.')[1];
        let result = 0;
        if (decimal) {
          result = parseInt(decimal.slice(0, fractions), 10);
          if (decimal.slice(1, 5) === '9999') result++;
        }
        return result;
      },
      _getRangeIcon: function (irange, turnOn) {
        return turnOn ? irange.on || this.opt.starOn : irange.off || this.opt.starOff;
      },
      _getScoreByPosition: function (evt, icon) {
        let score = parseInt(icon.alt || icon.getAttribute('data-alt'), 10);
        if (this.opt.half) score = score - 1 + parseFloat((evt.pageX - $(icon).offset().left) / this._getWidth());
        return score;
      },
      _getHint: function (score, evt) {
        if (score !== 0 && !score) return this.opt.noRatedMsg;
        let decimal = this._getDecimal(score, 1);
        let integer = Math.ceil(score);
        let group = this.opt.hints[(integer || 1) - 1];
        let hint = group;
        let set = !evt || this.isMove;
        if (this.opt.precision) {
          if (set) decimal = decimal === 0 ? 9 : decimal - 1;
          hint = group[decimal];
        } else if (this.opt.halfShow || this.opt.half) {
          decimal = set && decimal === 0 ? 1 : decimal > 5 ? 1 : 0;
          hint = group[decimal];
        }
        return hint === '' ? '' : hint || score;
      },
      _getWidth: function () {
        let width = this.stars[0].width || parseFloat(this.stars.eq(0).css('font-size'));
        if (!width) this._error('Could not get the icon width!');
        return width;
      },
      _lock: function () {
        let hint = this._getHint(this.scoreField.val());
        this.element.style.cursor = '';
        this.element.title = hint;
        this.scoreField.prop('readonly', true);
        this.stars.prop('title', hint);
        if (this.cancelButton) this.cancelButton.hide();
        this.self.data('readonly', true);
      },
      _nameForIndex: function (i) {
        return this.opt.score && this.opt.score >= i ? 'starOn' : 'starOff';
      },
      _resetTitle: function () {
        for (let i = 0; i < this.opt.number; i++) {
          this.stars[i].title = this._getHint(i + 1);
        }
      },
      _roundHalfScore: function (score) {
        let integer = parseInt(score, 10);
        let decimal = this._getDecimal(score, 1);
        if (decimal !== 0) {
          decimal = decimal > 5 ? 1 : 0.5;
        }
        return integer + decimal;
      },
      _roundStars: function (score, evt) {
        let name = this._starName(score, evt);
        if (name) this._setIcon(this.stars[Math.ceil(score) - 1], this.opt[name]);
      },
      _setIcon: function (star, icon) {
        star[this.opt.starType === 'img' ? 'src' : 'className'] = this.opt.path + icon;
      },
      _setPath: function () {
        this.opt.path = this.opt.path || '';
        if (this.opt.path && this.opt.path.slice(-1)[0] !== '/') this.opt.path += '/';
      },
      _setTarget: function (target, score) {
        if (score) score = this.opt.targetFormat.toString().replace('{score}', score);
        target.is(':input') ? target.val(score) : target.html(score);
      },
      _setTitle: function (score, evt) {
        if (score) this.stars[parseInt(Math.ceil(score), 10) - 1].title = this._getHint(score, evt);
      },
      _starName: function (score, evt) {
        let decimal = +(score % 1).toFixed(2);
        if (evt || this.isMove) return decimal > 0.5 ? 'starOn' : 'starHalf';
        if (decimal <= this.opt.round.down) return;
        if (this.opt.halfShow && decimal < this.opt.round.up) return 'starHalf';
        if (decimal < this.opt.round.full) return 'starOff';
        return 'starOn';
      },
      _target: function (score, evt) {
        if (this.opt.target) {
          let target = $(this.opt.target);
          if (!target.length) this._error('Target selector invalid or missing!');
          let mouseover = evt && evt.type === 'mouseover';
          if (score === undefined) {
            score = this.opt.targetText;
          } else if (score === null) {
            score = mouseover ? this.opt.cancelHint : this.opt.targetText;
          } else {
            score = this.opt.targetType === 'hint' ? this._getHint(score, evt) : parseFloat(score).toFixed(1);
            let mousemove = evt && evt.type === 'mousemove';
            if (!mouseover && !mousemove && !this.opt.targetKeep) score = this.opt.targetText;
          }
          this._setTarget(target, score);
        }
      },
      _turnOn: function (i, score) {
        return this.opt.single ? (i === score) : (i <= score);
      },
      _unlock: function () {
        this.element.style.cursor = 'pointer';
        this.element.removeAttribute('title');
        this.scoreField.removeAttr('readonly');
        this.self.data('readonly', false);
        this._resetTitle();
        if (this.cancelButton) this.cancelButton.css('display', '');
      },
      cancel: function (click) {
        if (this.self.data('readonly') !== true) {
          this[click ? 'click' : 'score'].call(this, null);
          this.scoreField.removeAttr('value');
        }
      },
      click: function (score) {
        if (this.self.data('readonly') !== true) {
          score = this._adjustedScore(score);
          this._apply(score);
          if (this.opt.click) this.opt.click.call(this.element, score, $.Event('click'));
          this._target(score);
        }
      },
      getScore: function () {
        let score = [];
        let value = this.scoreField.val();
        score.push(value ? +value : undefined);
        return score.length > 1 ? score : score[0];
      },
      move: function (score) {
        let integer = parseInt(score, 10);
        if (integer >= this.opt.number) integer = this.opt.number - 1;
        let star = $(this.stars[integer]);
        let percent = star.offset().left + stepsdecimal;
        let evt = $.Event('mousemove', { pageX: percent });
        this.isMove = true;
        star.trigger(evt);
        this.isMove = false;
      },
      readOnly: function (readonly) {
        if (this.self.data('readonly') !== readonly) {
          if (readonly) {
            this.self.off('.raty').children(this.opt.starType).off('.raty');
            this._lock();
          } else {
            this._binds();
            this._unlock();
          }
          this.self.data('readonly', readonly);
        }
      },
      score: function () {
        return arguments.length ? this.setScore.apply(this, arguments) : this.getScore();
      },
      setScore: function (score) {
        if (this.self.data('readonly') !== true) {
          score = this._adjustedScore(score);
          this._apply(score);
          this._target(score);
        }
      }
    };
    return Raty;
  })();
}));
