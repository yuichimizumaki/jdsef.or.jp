/* ========================================================
  Capsule Script
======================================================== */
/* Current Setting
  ※ クラス名や付加する場所を変えた時はscssも編集してください
  ※ いらないものはコメントアウトで動作が軽くなるかも
++++++++++++++++++++++++++++++++ */
/* capsule function
++++++++++++++++++++++++++++++++ */
(function ($) {
  $.capsule = {
    //言語取得
    getlang: function () {
      return $('html').attr('lang') || 'ja';
    },
    //スマホ判定
    isSP: function () {
      var ua = navigator.userAgent;
      return ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0;
    },
    //ブラウザ判定
    isBrowser: function () {
      var userAgent = window.navigator.userAgent.toLowerCase();
      if (
        userAgent.indexOf('msie') != -1 ||
        userAgent.indexOf('trident') != -1
      ) {
        return 'ie';
      } else if (userAgent.indexOf('edge') != -1) {
        return 'edge';
      } else if (userAgent.indexOf('chrome') != -1) {
        return 'chrome';
      } else if (userAgent.indexOf('safari') != -1) {
        return 'safari';
      } else if (userAgent.indexOf('firefox') != -1) {
        return 'firefox';
      } else if (userAgent.indexOf('opera') != -1) {
        return 'opera';
      } else {
        return 'other';
      }
    },
    // URIを解析したオブジェクトを返すfunction
    uri: function (path) {
      var self = this;
      this.originalPath = path;
      //絶対パスを取得
      this.absolutePath = (function () {
        var e = document.createElement('a');
        e.href = path;
        return e.href;
      })();
      //絶対パスを分解
      var fields = {
        schema: 2,
        username: 5,
        password: 6,
        host: 7,
        path: 9,
        query: 10,
        fragment: 11,
      };
      var r =
        /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(
          this.absolutePath
        );
      for (var field in fields) {
        this[field] = r[fields[field]];
      }
      this.querys = {};
      if (this.query) {
        $.each(self.query.split('&'), function () {
          var a = this.split('=');
          if (a.length == 2) self.querys[a[0]] = a[1];
        });
      }
    },
    //ブラウザ判定class付与
    browserClass: function (options) {
      var c = $.extend(
        {
          put: 'body',
          prefix: 'is-browser-',
        },
        options
      );
      var browser = $.capsule.isBrowser();
      $(c.put).addClass(c.prefix + browser);
    },
    // 自動再生可能か調べる
    isVideoAutoplay: function (options) {
      var c = $.extend(
        {
          selector: '.js-video-autoplay',
        },
        options
      );
      var videoElement = $(c.selector);
      return videoElement.autoplay;
    },
    // 自動再生可能でclass付与
    videoAutoplay: function (options) {
      var c = $.extend(
        {
          put: 'body',
          selector: '.js-video-autoplay',
          addTrueClass: 'is-video-autoplay',
          addFalseClass: 'no-video-autoplay',
        },
        options
      );
      if ($.capsule.isVideoAutoplay(c.selector)) {
        $(c.put).removeClass(c.addTrueClass);
      } else {
        $(c.put).removeClass(c.addFalseClass);
      }
    },
    isBrakepoint: function (size, number) {
      if (window.matchMedia('(' + size + '-width:' + number + 'px)').matches) {
        return true;
      } else {
        return false;
      }
    },
    brakepoint: function (options) {
      var c = $.extend(
        {
          put: 'body',
          brakepoint: 768,
          brakepointCriteria: 'min',
          addClass: 'is-mobile',
        },
        options
      );

      brakepointDecision();
      $(window).on('resize load', function () {
        brakepointDecision();
      });
      function brakepointDecision() {
        if ($.capsule.isBrakepoint(c.brakepointCriteria, c.brakepoint)) {
          $(c.put).removeClass(c.addClass);
        } else {
          $(c.put).addClass(c.addClass);
        }
      }
    },
    //ユニークな配列を取得
    uniqueArray: function (array) {
      var storage = new Object();
      var uniqueArray = new Array();
      var i, value;
      for (i = 0; i < array.length; i++) {
        value = array[i];
        if (!(value in storage)) {
          storage[value] = true;
          uniqueArray.push(value);
        }
      }
      return uniqueArray;
    },
    //ロード終了
    loaded: function (options) {
      var c = $.extend(
        {
          put: 'body',
          loadingClass: 'is-loading',
          addClass: 'is-loaded',
          timeout: 250,
          delay: 1000,
        },
        options
      );

      var progress = 0;
      var imgCount = $('img').length;
      $('img').each(function () {
        var src = $(this).attr('src');
        $('<img>')
          .attr('src', src)
          .on('load', function () {
            progress++;
          });
      });
      setInterval(function () {
        $('#progress-bar').css({
          width: (progress / imgCount) * 100 + '%',
        });
      }, 1);
      $(c.put).addClass(c.loadingClass);
      $(window).on('load', function () {
        setTimeout(function () {
          $(c.put)
            .delay(c.delay)
            .queue(function () {
              $(this).removeClass(c.loadingClass).addClass(c.addClass);
            });
        }, c.timeout);
      });
    },
    //現在のページと親ディレクトリへのリンク
    selflink: function (options) {
      var c = $.extend(
        {
          area: 'body',
          addClass: 'is-current',
          parentsClass: 'is-parent',
          hashIgnore: true,
        },
        options
      );
      var urlHash = location.hash;
      $(c.area + (c.area ? ' ' : '') + 'a[href]').each(function () {
        var href = new $.capsule.uri(this.getAttribute('href'));
        var path = location.href;

        if (c.hashIgnore) {
          path = path.replace(urlHash, '');
        }
        if (href.absolutePath == path && !href.fragment) {
          //同じ文書にリンク
          $(this).addClass(c.addClass);
        } else if (0 <= path.search(href.absolutePath)) {
          //親ディレクトリリンク
          $(this).addClass(c.parentsClass);
        }
      });
    },
    //カテゴリー内表示
    category: function (options) {
      var c = $.extend(
        {
          selector: '.js-same-category',
          addClass: 'is-same-category',
        },
        options
      );
      var bodyClasses = new Array();
      if ($('body').attr('class')) {
        bodyClasses = $('body').attr('class').split(' ');
      }
      for (var i = 0; i < bodyClasses.length; i++) {
        $(c.selector).each(function () {
          if ($(this).hasClass(bodyClasses[i])) {
            //初期表示
            $(this).addClass(c.addClass);
          }
        });
      }
    },
    // ハンバーガーメニュー
    hamburgerTrigger: function (options) {
      var c = $.extend(
        {
          selector: '.js-navigation-trigger',
          addClass: 'is-navigation-open',
          put: 'body',
          wrapperObject: true,
          wrapperSelector: '.global-main, .global-footer',
          wrapperClass: 'fix-wrapper',
        },
        options
      );

      var current_scrollY;
      if (c.wrapperObject) {
        $(c.wrapperSelector).wrapAll('<div>').parent().addClass(c.wrapperClass);
      }

      $(document).on(
        {
          click: function () {
            if ($(c.put).hasClass(c.addClass)) {
              //スクロール固定解除
              $('.' + c.wrapperClass).attr({ style: '' });
              // class remove
              $(c.put).removeClass(c.addClass);

              if (c.wrapperObject) {
                $(window).scrollTop(current_scrollY);
              }
            } else {
              if (c.wrapperObject) {
                current_scrollY = $(window).scrollTop();
                //スクロール固定
                $('.' + c.wrapperClass).css({ top: -1 * current_scrollY });
              }
              // class add
              $(c.put).addClass(c.addClass);
            }
          },
        },
        c.selector
      );

      $(window).on('resize', function () {
        $(c.put).removeClass(c.addClass);
      });
    },
    // Scroll Object
    scrollObject: function (options) {
      var c = $.extend(
        {
          generationClass: '.js-scroll-object',
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
          hasScroll: 'has-scroll',
        },
        options
      );
      var lang = $.capsule.getlang() || 'ja';
      var className = c.generationClass.slice(1);
      //スクロールエリアの設置
      scrollObject();
      $(window).on('resize', function () {
        scrollObject();
      });
      function scrollObject() {
        $.each(c.textSet, function (target, txt) {
          $(target).each(function () {
            var $this = $(this);
            if ($this.closest(c.generationClass).length == 0) {
              $this.addClass(c.generationClass + '__contents');
              //スクロール対象エリアの外側にdiv作成
              $this
                .wrap('<div class="' + className + '"></div>')
                .wrap('<div class="' + className + '__target"></div>');
              var $scrollWrap = $this.closest(c.generationClass + '__target');
              //スクロール説明文の設置
              $scrollWrap.before(
                '<p class="' + className + '__caution">' + txt[lang] + '</p>'
              );
            }
            var flame = $this.closest(c.generationClass).outerWidth();
            var contents = $this.outerWidth();
            if (flame < contents) {
              $this.closest(c.generationClass).addClass(c.hasScroll);
            } else {
              $this.closest(c.generationClass).removeClass(c.hasScroll);
            }
          });
        });
      }
    },
    // アンカーへのスクロールアニメーション
    ankerScroller: function (hash, speed, offset) {
      var target, position;
      target = $(hash);
      position = target.offset().top - offset;
      if (target) {
        $('body,html').stop().animate({ scrollTop: position }, speed);
      } else {
        return false;
      }
    },
    // load時のスクロールアニメーション
    loadScroller: function (options) {
      var c = $.extend(
        {
          speed: 500,
          timeout: 100,
          offset: 0,
        },
        options
      );
      //URLのハッシュ値を取得
      var urlHash = location.hash;
      //ハッシュ値があればページ内スクロール
      if (urlHash) {
        //スクロールを0に戻す
        $('body,html').stop().scrollTop(0);
        setTimeout(function () {
          //ロード時の処理を待ち、時間差でスクロール実行
          $.capsule.ankerScroller(urlHash, c.speed, c.offset);
        }, c.timeout);
      }
    },
    // ページ内のスクロールアニメーション
    pageScroller: function (options) {
      var c = $.extend(
        {
          selector: '.js-scroller', // a[href^="#"]
          speed: 500,
          offset: 0,
          return: false,
        },
        options
      );

      //通常のクリック時
      $(document).on(
        {
          click: function () {
            //ページ内リンク先を取得
            var href = $(this).attr('href');
            //リンク先が#か空だったらhtmlに
            var hash = href == '#' || href == '' ? 'html' : href;
            //スクロール実行
            $.capsule.ankerScroller(hash, c.speed, c.offset);
            //リンク無効化
            if (c.return == false) {
              return false;
            }
          },
        },
        c.selector
      );
    },
    bottomScroll: function (options) {
      var c = $.extend(
        {
          put: 'body',
          addClass: 'is-bottom-scroll',
          topFixClass: 'is-scrolling',
          firstDelay: 200,
        },
        options
      );
      var startPos = 0,
        winScrollTop = 0;
      $(window).on('scroll', function () {
        winScrollTop = $(this).scrollTop();
        if (winScrollTop <= c.firstDelay) {
          $(c.put).removeClass(c.topFixClass);
        } else {
          $(c.put).addClass(c.topFixClass);
        }
        if (winScrollTop >= startPos) {
          if (winScrollTop >= c.firstDelay) {
            $(c.put).addClass(c.addClass);
          }
        } else {
          $(c.put).removeClass(c.addClass);
        }
        startPos = winScrollTop;
      });
    },
    pageToTop: function (options) {
      var c = $.extend(
        {
          id: 'pagetop',
          className: 'pagetop-button',
          text: 'Page Top',
          speed: 500,
          append: 'body',
        },
        options
      );
      $('body').prepend('<a id="' + c.id + '" name="' + c.id + '"></a>');
      $(c.append).append(
        '<a href="#' +
        c.id +
        '" class="' +
        c.className +
        '"><span>' +
        c.text +
        '</span></a>'
      );
      $.capsule.pageScroller({
        selector: '.' + c.className, // a[href^="#"]
        speed: c.speed,
        offset: 0,
        return: false,
      });
    },
    scrollShow: function (options) {
      var c = $.extend(
        {
          selector: '.js-scroll-show',
          addClass: 'is-show',
          again: true,
          bottomRatio: 5,
        },
        options
      );
      appearance();
      $(window).scroll(function () {
        appearance();
      });
      function appearance() {
        if ($(c.selector).length != 0) {
          $(c.selector).each(function () {
            var position = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            var appearancePoint = windowHeight / c.bottomRatio;
            if (scroll > position - windowHeight + appearancePoint) {
              $(this).addClass(c.addClass);
            } else {
              if (c.again) {
                $(this).removeClass(c.addClass);
              }
            }
          });
        }
      }
    },
    scrollChangeArea: function (options) {
      var c = $.extend(
        {
          position: 200, //ウインドウ上部からどれぐらいの位置で変化させるか
          areaSelector: '.js-scroll-change',
          navSelector: '.js-scroll-change-nav',
          addClass: 'is-current',
        },
        options
      );
      var current = -1;
      var boxPosition = new Array();
      var boxID = new Array();

      //各要素の位置
      //position-nowは場所を取得したい対象の要素に付ける
      $(c.areaSelector).each(function (i) {
        boxPosition[i] = $(this).offset().top;
        boxID[i] = $(this).attr('id');
      });
      //最初の要素にclass="positiion-now"をつける
      changeAreaLink(c.navSelector, c.addClass, 0, boxID[0]);
      //スクロールした時の処理
      $(window).scroll(function () {
        //var scrollPosition = $(window).scrollTop();
        for (var i = boxPosition.length - 1; i >= 0; i--) {
          if ($(window).scrollTop() > boxPosition[i] - c.position) {
            changeAreaLink(c.navSelector, c.addClass, i, boxID[i]);
            break;
          }
        }
      });
      function changeAreaLink(selector, addClass, sectionNumber, sectionID) {
        //var sectionNumberSecond;
        if (sectionNumber != current) {
          current = sectionNumber;
          /*
          sectionNumberSecond = sectionNumber + 1; //以下にクラス付与したい要素名と付与したいクラス名*/
          $(selector).find('a').removeClass(addClass);
          $(selector)
            .find('a[href="#' + sectionID + '"]')
            .addClass(addClass);
        }
      }
    },
    //tab
    tabMenu: function (options) {
      var c = $.extend(
        {
          tabGroupSelector: '.js-tab-group',
          tabMenuSelector: '.js-tab-menu',
          tabPanelSelector: '.js-tab-panel',
          addClass: 'is-active',
          scroll: true,
          scrollSpeed: 500,
          scrollOffset: 0,
          return: false,
        },
        options
      );

      //URLのハッシュ値を取得
      var urlHash = location.hash;
      var tabHashSelect;
      var tabContents;
      var scrollTarget;
      //ハッシュ値があればページ内スクロール
      if (urlHash) {
        tabHashSelect = $(urlHash).parents(c.tabGroupSelector);
        tabContents = urlHash;

        $(tabHashSelect).find(c.tabPanelSelector).removeClass(c.addClass);
        $(tabHashSelect)
          .find(c.tabMenuSelector + ' a')
          .removeClass(c.addClass);
      }

      $($(c.tabMenuSelector).find('a')).each(function () {
        $(this).hasClass(c.addClass);
      });
      if ($(c.tabMenuSelector).find('a').hasClass(c.addClass)) {
        tabContents = $(this).attr('href');
      } else {
        tabContents = $(c.tabMenuSelector)
          .find('li')
          .eq(0)
          .find('a')
          .attr('href');
      }

      $(tabContents).addClass(c.addClass);
      $("a[href='" + tabContents + "']").addClass(c.addClass);

      $(c.tabMenuSelector)
        .find('a')
        .click(function () {
          tabContents = $(this).attr('href');

          $(this)
            .parents(c.tabGroupSelector)
            .find(c.tabPanelSelector)
            .removeClass(c.addClass);
          $(this)
            .parents(c.tabGroupSelector)
            .find(c.tabMenuSelector + ' a')
            .removeClass(c.addClass);

          $(tabContents).addClass(c.addClass);
          $("a[href='" + tabContents + "']").addClass(c.addClass);
          if (c.scroll) {
            scrollTarget = $(this).parents(c.tabGroupSelector);
            $.capsule.ankerScroller(
              scrollTarget,
              c.scrollSpeed,
              c.scrollOffset
            );
          }

          if (c.return == false) {
            return false;
          }
        });
    },
    // コンテンツをウインドウの高さに揃える
    windowFixer: function (options) {
      var c = $.extend(
        {
          fix: '.main-contents', // 高さを合わせるターゲット
          exceptArray: [
            // windowの高さから引くオブジェクト（配列）
            '.global-footer',
          ],
          trigger: '.js-window-fixer', // ボタンでwindowFixerを動作させるクラス
          triggerDelay: 500, // ボタンでwindowFixerを動作させるときどれくらい遅らせるか
        },
        options
      );
      fixCal();
      $(window).on('load resize', function () {
        fixCal();
      });
      $(document).on(
        {
          click: function () {
            setTimeout(function () {
              fixCal();
            }, c.triggerDelay);
          },
        },
        c.trigger
      );

      function fixCal() {
        var exceptH = 0;
        var contentsH;
        var wh = $(window).height();

        $.each(c.exceptArray, function (index, val) {
          if ($(val).length) {
            exceptH += $(val).outerHeight();
          } else {
            exceptH += 0;
          }
        });
        contentsH = wh - exceptH;

        if ($(c.fix).length) {
          $(c.fix).css({
            'min-height': contentsH,
          });
        }
      }
    },
    // スタイルスイッチャー
    // js.cookie.js 必須
    styleSwitch: function (options) {
      var c = $.extend(
        {
          trigger: '.js-style-switch', // スタイルスイッチのセレクター
          cookieKey: 'style', // クッキーの登録名
          defaultVar: 'def', // デフォルトの値
          classPrefix: 'is-style-', // クッキーの値にPrefix
          dataName: 'style', // スイッチャーセレクターの dataの名前
          put: 'body', // どこにclassをつけるか
        },
        options
      );
      $(window).on('load', function () {
        if (!Cookies.get(c.cookieKey)) {
          Cookies.set(c.cookieKey, c.defaultVar);
        }
        getCookie();
      });
      $(document).on(
        {
          click: function () {
            Cookies.set(c.cookieKey, $(this).data(c.dataName));
            getCookie();
          },
        },
        c.trigger
      );
      function getCookie() {
        var cVar, reg;
        cVar = Cookies.get(c.cookieKey);
        $(c.put).removeClass(function (index, ca) {
          reg = new RegExp('\\b' + c.classPrefix + '\\S+', 'g');
          return (ca.match(reg) || []).join(' ');
        });
        $(c.put).addClass(c.classPrefix + cVar);
      }
    },
  };
})(jQuery);

/* js.cookie.js
++++++++++++++++++++++++++++++++ */
/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/js-cookie@2.2.1/src/js.cookie.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!(function (e) {
  var n;
  if (
    ('function' == typeof define && define.amd && (define(e), (n = !0)),
      'object' == typeof exports && ((module.exports = e()), (n = !0)),
      !n)
  ) {
    var t = window.Cookies,
      o = (window.Cookies = e());
    o.noConflict = function () {
      return (window.Cookies = t), o;
    };
  }
})(function () {
  function e() {
    for (var e = 0, n = {}; e < arguments.length; e++) {
      var t = arguments[e];
      for (var o in t) n[o] = t[o];
    }
    return n;
  }
  function n(e) {
    return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }
  return (function t(o) {
    function r() { }
    function i(n, t, i) {
      if ('undefined' != typeof document) {
        'number' == typeof (i = e({ path: '/' }, r.defaults, i)).expires &&
          (i.expires = new Date(1 * new Date() + 864e5 * i.expires)),
          (i.expires = i.expires ? i.expires.toUTCString() : '');
        try {
          var c = JSON.stringify(t);
          /^[\{\[]/.test(c) && (t = c);
        } catch (e) { }
        (t = o.write
          ? o.write(t, n)
          : encodeURIComponent(String(t)).replace(
            /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
            decodeURIComponent
          )),
          (n = encodeURIComponent(String(n))
            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
            .replace(/[\(\)]/g, escape));
        var f = '';
        for (var u in i)
          i[u] &&
            ((f += '; ' + u), !0 !== i[u] && (f += '=' + i[u].split(';')[0]));
        return (document.cookie = n + '=' + t + f);
      }
    }
    function c(e, t) {
      if ('undefined' != typeof document) {
        for (
          var r = {},
          i = document.cookie ? document.cookie.split('; ') : [],
          c = 0;
          c < i.length;
          c++
        ) {
          var f = i[c].split('='),
            u = f.slice(1).join('=');
          t || '"' !== u.charAt(0) || (u = u.slice(1, -1));
          try {
            var a = n(f[0]);
            if (((u = (o.read || o)(u, a) || n(u)), t))
              try {
                u = JSON.parse(u);
              } catch (e) { }
            if (((r[a] = u), e === a)) break;
          } catch (e) { }
        }
        return e ? r[e] : r;
      }
    }
    return (
      (r.set = i),
      (r.get = function (e) {
        return c(e, !1);
      }),
      (r.getJSON = function (e) {
        return c(e, !0);
      }),
      (r.remove = function (n, t) {
        i(n, '', e(t, { expires: -1 }));
      }),
      (r.defaults = {}),
      (r.withConverter = t),
      r
    );
  })(function () { });
});

/* jquery.mousewheel.js
++++++++++++++++++++++++++++++++ */
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
!(function ($) {
  var types = ['DOMMouseScroll', 'mousewheel'];
  if ($.event.fixHooks)
    for (var i = types.length; i;)
      $.event.fixHooks[types[--i]] = $.event.mouseHooks;
  function handler(event) {
    var orgEvent = event || window.event,
      args = [].slice.call(arguments, 1),
      delta = 0,
      returnValue = !0,
      deltaX = 0,
      deltaY = 0;
    return (
      ((event = $.event.fix(orgEvent)).type = 'mousewheel'),
      orgEvent.wheelDelta && (delta = orgEvent.wheelDelta / 120),
      orgEvent.detail && (delta = -orgEvent.detail / 3),
      (deltaY = delta),
      void 0 !== orgEvent.axis &&
      orgEvent.axis === orgEvent.HORIZONTAL_AXIS &&
      ((deltaY = 0), (deltaX = -1 * delta)),
      void 0 !== orgEvent.wheelDeltaY && (deltaY = orgEvent.wheelDeltaY / 120),
      void 0 !== orgEvent.wheelDeltaX &&
      (deltaX = (-1 * orgEvent.wheelDeltaX) / 120),
      args.unshift(event, delta, deltaX, deltaY),
      ($.event.dispatch || $.event.handle).apply(this, args)
    );
  }
  ($.event.special.mousewheel = {
    setup: function () {
      if (this.addEventListener)
        for (var i = types.length; i;)
          this.addEventListener(types[--i], handler, !1);
      else this.onmousewheel = handler;
    },
    teardown: function () {
      if (this.removeEventListener)
        for (var i = types.length; i;)
          this.removeEventListener(types[--i], handler, !1);
      else this.onmousewheel = null;
    },
  }),
    $.fn.extend({
      mousewheel: function (fn) {
        return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
      },
      unmousewheel: function (fn) {
        return this.unbind('mousewheel', fn);
      },
    });
})(jQuery);

