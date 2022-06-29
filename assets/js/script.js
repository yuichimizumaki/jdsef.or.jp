'use srtict';
$(function () {

  // ハンバーガーメニュー
  $.capsule.hamburgerTrigger({
    selector: '.js-navigation-trigger', // トリガーとなるクラス
    addClass: 'is-navigation-open', // 'put' にどんなclassをつけるか
    put: 'body', // どこに 'addClass' をつけるか
    wrapperObject: true, // wrapper で包むか
    wrapperSelector: '.global-main, .global-footer', // wrapper は何を包むか
    wrapperClass: 'fix-wrapper', // wrapper にどんなclassをつけるか
  });
});