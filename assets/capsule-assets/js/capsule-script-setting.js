/* ========================================================
  Capsule Script
======================================================== */
/* Current Setting
  ※ クラス名や付加する場所を変えた時はscssも編集してください
  ※ いらないものはコメントアウトで動作が軽くなるかも
++++++++++++++++++++++++++++++++ */
/* capsule setting
++++++++++++++++++++++++++++++++ */
'use srtict';
$(function () {
  var scrollSpeed = 500,
    scrollOffset = 0,
    activeClass = 'is-active',
    currentClass = 'is-current';
  // ブラウザ判定
  $.capsule.browserClass({
    put: 'body', // どこにclassをつけるか
    prefix: 'is-browser-', // classにprefixする文字
  });
  // ロード判定
  $.capsule.loaded({
    put: 'body', // どこにclassをつけるか
    addClass: 'is-loaded', // どんなclassをつけるか
    timeout: 250, // ロード処理を強制的に中止する時間
    delay: 3000, // ロードが終わってからどれくらい待つか
  });
  // ブレイクポイント判定
  $.capsule.brakepoint({
    put: 'body', // どこにclassをつけるか
    brakepoint: 768, // ブレイクポイント
    brakepointCriteria: 'min', // 'min' か 'max' かブレイクポイント基準
    addClass: 'is-mobile', // 'brakepoint' 以下になると'put'にaddClass
  });
  // ブレイクポイント判定
  $.capsule.brakepoint({
    put: 'body', // どこにclassをつけるか
    brakepoint: 768, // ブレイクポイント
    brakepointCriteria: 'min', // 'min' か 'max' かブレイクポイント基準
    addClass: 'is-mobile', // 'brakepoint' 以下になると'put'にaddClass
  });
  // 自動再生可能でclass付与
  $.capsule.videoAutoplay({
    put: 'body',
    addTrueClass: 'is-video-autoplay',
    addFalseClass: 'no-video-autoplay',
  });
  // カレントリンク
  $.capsule.selflink({
    area: 'body', // どの範囲で有効にするか
    addClass: currentClass, // どんなclassをつけるか
    parentsClass: 'is-parent', // 親リンクの時はどんなclassをつけるか
    hashIgnore: true, // URLのハッシュタグを無視する trueの時 urlが/xxx.html#xxx でも /xxx.html には'addClass'がつく
  });
  // 同カテゴリ判定
  // 'selector' の ついたタグに<body>と同じ class あれば 'addClass' がつく
  $.capsule.category({
    selector: '.js-same-category', // ターゲットのクラス
    addClass: 'is-same-category', // どんなclassをつけるか
  });
  // ハンバーガーメニュー
  $.capsule.hamburgerTrigger({
    selector: '.js-navigation-trigger', // トリガーとなるクラス
    addClass: 'is-navigation-open', // 'put' にどんなclassをつけるか
    put: 'body', // どこに 'addClass' をつけるか
    wrapperObject: true, // wrapper で包むか
    wrapperSelector: '.global-main, .global-footer', // wrapper は何を包むか
    wrapperClass: 'fix-wrapper', // wrapper にどんなclassをつけるか
  });
  // スクロールオブジェクト
  $.capsule.scrollObject({
    generationClass: '.js-scroll-object', // オブジェクトを包むclass名
    textSet: {
      '.js-scroll-table': {
        ja: 'この表は左右にスクロールできます',
        en: 'This table can scroll to the left or right.',
      },
      '.js-scroll-graph': {
        ja: 'このグラフは左右にスクロールできます',
        en: 'This graph can scroll to the left or right.',
      },
      '.js-scroll-area': {
        ja: 'このエリアは左右にスクロールできます',
        en: 'This area can scroll to the left or right.',
      },
    },
  });
  // ロードスクローラー
  // ハッシュが着いたリンクで飛んできた時にスクロールアニメーション
  $.capsule.loadScroller({
    speed: scrollSpeed, // スクロールスピード
    timeout: 100, // ロード時の処理を待ちの時間差
    offset: scrollOffset, // オフセット
  });
  // クリックスクローラー
  // ページ内リンクのスクロールアニメーション
  $.capsule.pageScroller({
    selector: '.js-scroller', // トリガーとなるクラス
    speed: scrollSpeed, // スクロールスピード
  });
  // ボトムスクロール判定
  // 下へスクロールするときにaddClass
  $.capsule.bottomScroll({
    put: 'body', // どこに 'addClass' をつけるか
    addClass: 'is-bottom-scroll', // 下にスクロールするときのクラス名
    topFixClass: 'is-scrolling', // firstDelayより下にスクロールするときのクラス名
    firstDelay: 200, // 0 ~ 'firstDelay'(px) までは処理を行わない
  });
  $.capsule.pageToTop({
    id: 'pagetop',
    selector: 'js-scroller',
    text: 'Page Top',
  });
  // スクロール出現判定
  // スクロールして 'selector' が出現するときにaddClass
  $.capsule.scrollShow({
    selector: '.js-scroll-show', // ターゲットのクラス
    addClass: 'is-show', // どんなclassをつけるか
    again: true, // 上の方へスクロールして再び隠れたら 'addClass' を外すかどうか
    bottomRatio: 5, // window ÷ 'bottomRatio' で発火する
  });

  $.capsule.scrollChangeArea({
    position: 200, //ウインドウ上部からどれぐらいの位置で変化させるか
    areaSelector: '.js-scroll-change',
    navSelector: '.js-scroll-change-nav',
    addClass: currentClass,
  });

  $.capsule.tabMenu({
    tabGroupSelector: '.js-tab-group',
    tabMenuSelector: '.js-tab-menu',
    tabPanelSelector: '.js-tab-panel',
    addClass: activeClass,
    scroll: true,
    scrollSpeed: scrollSpeed,
    scrollOffset: scrollOffset,
    return: false,
  });

  // コンテンツをウインドウの高さに揃える
  $.capsule.windowFixer({
    fix: '.main-contents', // 高さを合わせるターゲット
    exceptArray: [
      // windowの高さから引くオブジェクト（配列）
      '.global-footer',
    ],
    trigger: '.js-window-fixer', // ボタンでwindowFixerを動作させるクラス
    triggerDelay: 500, // ボタンでwindowFixerを動作させるときどれくらい遅らせるか
  });
  // スタイルスイッチャー
  $.capsule.styleSwitch({
    trigger: '.js-style-switch', // スタイルスイッチのセレクター
    cookieKey: 'style', // クッキーの登録名
    defaultVar: 'def', // デフォルトの値
    classPrefix: 'is-style-', //　クッキーの値にPrefix
    dataName: 'style', // スイッチャーセレクターの dataの名前
    put: 'body', // どこにclassをつけるか
  });
});
