var util = {
  /**
  * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，action 才会执行
  * @param idle   {number}    空闲时间，单位毫秒
  * @param action {function}  请求关联函数，实际应用需要调用的函数
  * @return {function}    返回客户调用函数
  */
  debounce: function(action, idle){
    var last
    return function(){
      var ctx = this, args = arguments
      clearTimeout(last)
      last = setTimeout(function(){
          action.apply(ctx, args)
      }, idle)
    }
  },
  /**
  * 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
  * @param delay  {number}    延迟时间，单位毫秒
  * @param action {function}  请求关联函数，实际应用需要调用的函数
  * @return {function}    返回客户调用函数
  */
  throttle: function(action, delay){
    var last = 0;
    return function(){
      var curr = +new Date()
      if (curr - last > delay){
        action.apply(this, arguments)
        last = curr 
      }
    }
  }
}

/*
 *
 * File Name : function.js [use jquery]
 *
 */


/*********************************************************************************************/
// 判断浏览器ua
// ex) if(util.isTablet){ ... } // true or false
/*********************************************************************************************/
var util = (function (u) {
  return {
    isTablet: (u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) || u.indexOf("ipad") != -1 || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1),

    isAndroid: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1) || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1),

    isIOS: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1) || u.indexOf("iphone") != -1 || u.indexOf("ipod") != -1,

    isWebview: (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) && /twitter|fbav|line/.test(navigator.userAgent.toLowerCase()))
  };
})(window.navigator.userAgent.toLowerCase());
/*********************************************************************************************/



/*********************************************************************************************/
// 判断窗口大小
// ex) if(viewportCheck.isSP()){ ... } // true or false
/*********************************************************************************************/

var viewportCheck = (function () {
  var isSP = function () {
    return window.innerWidth <= 767;
  };

  var isTB = function () {
    return (window.innerWidth >= 768) && (window.innerWidth <= 1279);
  };

  var isPC = function () {
    return window.innerWidth >= 1280;
  };

  return {
    isSP: isSP,
    isTB: isTB,
    isPC: isPC
  };

})();
/*********************************************************************************************/




/*********************************************************************************************/
// 判断ios、android版本
/*********************************************************************************************/
// iOS
function ios_ver() {
  var ios_ua = navigator.userAgent;
  if (ios_ua.indexOf("iPhone") > 0) {
    /*
    ios_ua.match(/iPhone OS (\w+){1,3}/g);
    var version = (RegExp.$1.replace(/_/g, '')+'00').slice(0,3);
    */
    var version = ios_ua.match(/(iPhone OS .* like Mac OS X)/g);
    version = version[0].split(' ');
    version = version[2].split('_');
    version = version[0] + '00';

    return version;
  }
}

// Android
function and_ver() {
  var and_ua = navigator.userAgent;
  if (and_ua.indexOf("Android") > 0) {
    var version = parseFloat(and_ua.slice(and_ua.indexOf("Android") + 8));
    return version;
  }
}
/*********************************************************************************************/



/*********************************************************************************************/
// 页面滚动
/*********************************************************************************************/
jQuery.extend( jQuery.easing, 
  { 
  easeOutExpo: function (x, t, b, c, d) { 
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; 
  }, 
  easeOutBounce: function (x, t, b, c, d) { 
    if ((t/=d) < (1/2.75)) { 
      return c*(7.5625*t*t) + b; 
    } else if (t < (2/2.75)) { 
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b; 
    } else if (t < (2.5/2.75)) { 
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b; 
    } else { 
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b; 
    } 
  }, 
});
var isHtmlScroll = (function () {
  var html = $('html'),
    top = html.scrollTop();
  var el = $('<div/>').height(10000).prependTo('body');
  html.scrollTop(10000);
  var rs = !!html.scrollTop();
  html.scrollTop(top);
  el.remove();
  return rs;
})();

function smoothScroll(target, callback) {
  var speed = 1000;
  var easing = 'easeOutExpo';
  //var t = ( window.chrome || 'WebkitAppearance' in document.documentElement.style )? 'body' : 'html';
  var t = $(isHtmlScroll ? 'html' : 'body');
  $(t).queue([]).stop();
  var $targetElement = $(target);
  var scrollTo = $targetElement.offset().top;
  var maxScroll;
  if (window.scrollMaxY) {
    maxScroll = window.scrollMaxY;
  } else {
    maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }
  if (scrollTo > maxScroll) {
    scrollTo = maxScroll;
  }
  $(t).stop(true, true).animate({
    scrollTop: scrollTo
  }, speed, easing, function () {
    if (typeof callback === 'function' && callback()) {
      callback();
    }
  });
}
/*********************************************************************************************/


/*********************************************************************************************/
// 根据滚动位置追加class
/*********************************************************************************************/
(function ($) {
  $.fn.scrollClass = function (c) {
    var defaults = {};
    var config = $.extend(defaults, c);
    var target = this;
    var _window = $(window);

    function addAction() {
      var length = target.length;
      for (var i = 0; i < length; i++) {
        if (target.eq(i).hasClass('action')) continue;

        var in_position = target.eq(i).offset().top + 200;
        var window_bottom_position = _window.scrollTop() + _window.height();
        if (in_position < window_bottom_position) {
          target.eq(i).addClass('action');
        }
      }
    }
    addAction();

    $(window).on('scroll', function () {
      addAction();
    });
    return target;
  };
})(jQuery);
/*********************************************************************************************/

$(window).on('load', function () {
  // menu button
  var toggleMenu = function () {
    var _window = $(window);
    var windowH = _window.height();
    var _btnMenu = $('#btnMenu');
    var _globalH = $('#globalHeader');
    var _globalNavi = $('#globalNavi');
    var _container = $('#globalWrapper');
    var _globalFooter = $('#globalFooter');
    var t = $(isHtmlScroll ? 'html' : 'body');
    var openFlag = false;
    var beforePos;

    // 追加样式
    var scroll = function () {
      if (util.isIOS || util.isAndroid) {
        if (ios_ver() >= 700 || and_ver() >= 4.4) {
          _globalH.css({
            'position': 'fixed'
          });
        } else {
          _globalH.css({
            'position': 'absolute'
          });
        }
      } else {
        _globalH.css({
          'position': 'fixed'
        });
      }
    };


    // init
    scroll();

    $(window).on('scroll', function () {
      scroll();
    });

    _btnMenu.on('click', function () {
      if (viewportCheck.isSP()) {
        if (openFlag === false) {
          openFlag = true;
          beforePos = _window.scrollTop();
          $([_btnMenu[0], _globalNavi[0]]).addClass('active');
          setTimeout(function () {
            _globalNavi.css({
              'position': 'absolute'
            });
            $(t).scrollTop(0);
            $([_container[0], _globalFooter[0]]).toggleClass('hide');
          }, 400);
        } else {
          openFlag = false;
          _globalNavi.css({
            'position': 'fixed'
          });
          $([_btnMenu[0], _globalNavi[0]]).removeClass('active');
          $([_container[0], _globalFooter[0]]).toggleClass('hide');
          $(t).scrollTop(beforePos);
        }
      } else {
        if (openFlag === false) {
          openFlag = true;
          $([_btnMenu[0], _globalNavi[0]]).addClass('active');
          setTimeout(function () {
            $([_container[0], _globalFooter[0]]).toggleClass('hide');
          }, 400);
        } else {
          openFlag = false;
          $([_btnMenu[0], _globalNavi[0]]).removeClass('active');
          $([_container[0], _globalFooter[0]]).toggleClass('hide');
        }
      }
    });
  };

  toggleMenu();
});


$(function () {
  $('a.scroll').on('click', function () {
    var hash = $(this).attr('href');
    smoothScroll(hash);
    return false;
  });
});


/*-----------------------------------------------------------
 *
 * 電話番号リンク
 * スマホだけ生かす
 *
 *-----------------------------------------------------------*/
var agent = navigator.userAgent;
if (agent.search(/iPhone/) != -1) {
  // iPhone
} else if (agent.search(/Android/) != -1) {
  // Android
} else {
  // それ以外
  $('.spCall').addClass('spCallPc');
  $('.spCall').on('click', function () {
    // 動作キャンセル
    return false;
  })
}


//---------------------------------------------------------
//
//先頭に戻るボタンの追尾
//
//---------------------------------------------------------
$(function () {

  var $window = $(window),
    userAgent = window.navigator.userAgent.toLowerCase(),
    appVersion = window.navigator.appVersion.toLowerCase(),
    $pageTop = $("#pagetop"),
    pageTopImg = $("#pagetop img"),
    polaFooterElem = $('#globalFooter'),
    footerNavitOffset = polaFooterElem.offset(),
    pageTop = $window.height() - $pageTop.find('img').height() - 0,
    scImgHeight = $pageTop.find('img').height(),
    adjustedValueFooter = 83, //読み込み時位置
    adjustedValuePageTop = 20, //余白
    target,
    moveFlg = 0,
    topMove = 0;

  //------------------------------------
  // 振り分け
  //------------------------------------
  if ((appVersion.indexOf("android") >= 0) || (appVersion.indexOf("ipad") >= 0) || (appVersion.indexOf("iphone") >= 0)) {

    //------------------------------------
    // 先頭に戻るボタン追従処理
    //------------------------------------
    $window.scroll(function () {
      if (topMove == 0) {
        footerNavitOffset = polaFooterElem.offset();
        pageTop = $window.height() - scImgHeight - adjustedValuePageTop;

        //アニメーション
        var s = $(this).scrollTop(),
          pageTop = $("#pagetop");

        if (s < 1) {
          pageTop.stop(true, true).fadeOut('slow', function () {
            moveFlg = 0;
          });
        } else {
          pageTop.stop(true, true).fadeIn('fast');
        }

        // ボタンの現在の位置
        winBottom = parseInt($window.scrollTop()) + parseInt(window.innerHeight);
        $("#pagetop").css('bottom', '25px');
        $("#pagetop").css('right', '25px');
      }

    });

  } else {
    //------------------------------------
    // 先頭に戻るボタン追従処理
    //------------------------------------
    $window.scroll(function () {

      if (topMove == 0) {
        footerNavitOffset = polaFooterElem.offset();
        pageTop = $window.height() - scImgHeight - adjustedValuePageTop;

        //アニメーション
        var s = $(this).scrollTop(),
          pageTop = $("#pagetop");

        if (s < 1) {
          pageTop.stop(true, true).fadeOut('slow', function () {
            moveFlg = 0;
          });
        } else {
          pageTop.stop(true, true).fadeIn('slow');
        }

        // ボタンの現在の位置
        if (userAgent.indexOf("msie") != -1) {
          if (appVersion.indexOf("msie 6.") >= 0 || appVersion.indexOf("msie 7.") >= 0 || appVersion.indexOf("msie 8.") >= 0) {
            winBottom = parseInt($window.scrollTop()) + document.documentElement.clientHeight;
          } else {
            winBottom = parseInt($window.scrollTop()) + parseInt(window.innerHeight);
          }
        } else {
          winBottom = parseInt($window.scrollTop()) + parseInt(window.innerHeight);
        }

        if (winBottom > footerNavitOffset.top) {
          pageTop = parseInt(footerNavitOffset.top) - parseInt(adjustedValueFooter);
          $pageTop.css('position', 'absolute');
          $pageTop.css('top', pageTop + 'px');
        } else {
          $pageTop.css('position', 'fixed');
          $pageTop.css('top', '');
        }
      }


    });

  }
  $("a.insideLink").click(function () {
    if (moveFlg == 1) return false;
    moveFlg = 1;

    target = $($(this).attr('href'));
    if (target.length == 0) return;

    $("#pagetop").fadeOut('slow', function () {
      moveFlg = 0;
    });
    topMove = 1;

    $('html,body').animate({
      scrollTop: $(target).offset().top
    }, 450, "easeOutQuart", function () { /*topMove = 0;*/ });
    return false;
  });
});

//-----------------------------------------
// ページ遷移時のスクロール処理
//   ハッシュタグは以下のルールで
//   #ページ内遷移させたいID_MV
//   _MVをつけます。
//
//   HTML上のidは_MVが無いもので設置します。
//
//-----------------------------------------
$(window).load(function () {

  var scrollTarget = location.hash,
    targetElem = "";

  if (scrollTarget.indexOf('#/') >= 0) return false;

  if (scrollTarget && $(scrollTarget.replace('_MV', "")).length > 0) {
    $('body,html').stop().scrollTop(0);
    setTimeout(function () {
      //----------------------------
      // スムーススクロール用の要素抽出
      //----------------------------
      if (scrollTarget.indexOf('_MV') >= 0) {
        scrollTarget = location.hash.replace('_MV', ""), // スクロールしたい要素情報
          targetElem = $(scrollTarget); // 要素情報を参考にエレメントを取得
      }
      if (targetElem.length <= 0) {
        // ハッシュタグが存在しない場合は、最後に_MVをつける
        targetElem = $(scrollTarget + '_MV');
      }
      //----------------------------
      // スムーススクロール処理
      //----------------------------
      if (targetElem.length <= 0) return false;
      var position = targetElem.offset().top - $('#globalHeader').outerHeight();
      $('body,html').animate({
        scrollTop: position
      }, 900, 'easeOutQuart');
      return false;
    }, 500)

  }

  /*
    var scrollTarget  = location.hash.replace('_MV',""),   // スクロールしたい要素情報
        targetElem    = $(scrollTarget); // 要素情報を参考にエレメントを取得

    if(targetElem.length <= 0) return false;
    var position     = targetElem.offset().top-$('#globalHeader').outerHeight();
    $('body,html').animate({scrollTop:position}, 900, 'easeOutQuart');
    return false;


    var scrollTarget2  = location.hash.replace('advice',"advice"),   // スクロールしたい要素情報
        targetElem2    = $(scrollTarget2); // 要素情報を参考にエレメントを取得

    if(targetElem2.length <= 0) return false;
    var position2     = targetElem2.offset().top-$('#globalHeader').outerHeight();
    $('body,html').animate({scrollTop:position2}, 900, 'easeOutQuart');
    return false;
  */
});


$(function () {
  var headerHight = 75; //ヘッダの高さ
  $('a[href^="#"]').on('click', function () {
    if ($(this).hasClass('popup-modal') == true) return false;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - headerHight; //ヘッダの高さ分位置をずらす
    var speed = 550;
    if ($(this).hasClass('globalNaviAnchorLink')) {
      $('.menu-trigger').trigger('click');
      position = target.offset().top - headerHight; //ヘッダの高さ分位置をずらす
      speed = 700;
    }

    setTimeout(function () {
      $("html, body").animate({
        scrollTop: position
      }, speed, "easeOutExpo");
    }, 500);

    return false;
  });
});


//---------------------------------------------------------
//
//現在地から探す
//
//---------------------------------------------------------

if (util.isAndroid || util.isTablet || util.isIOS) {
  $('#storesearch_list').append('<option value="storesearch_here">現在地から探す</option>');
}


//---------------------------------------------------------
//
//地図アプリで見る
//
//---------------------------------------------------------

if (util.isAndroid || util.isTablet || util.isIOS) {
  $('#map_list').prepend('<li class="map_app"><a href="#">地図アプリで見る</a></li>');
}


//---------------------------------------------------------
//
//サイドバー追尾 .right_box / .left_box / .side_box
//
//---------------------------------------------------------

$(function () {

  var side_box = $(".side_box");

  if ($('.contents_wrapper').length > 0) {
    $(window).on("scroll", function () {

      var scroll;
      var window_height = $(window).height();
      var body_height = $("body").outerHeight();

      //判別の為とりあえず$( "body" ).scrollTop()で取得してみる
      //var scroll_distinction = $( "body" ).scrollTop();
      //body要素でスクロールを取得できているか
      //出来ていませんでしましましたら"html"出来ていたら"body"
      /*`
      if( scroll_distinction === 0 || scroll_distinction == false ){
          scroll = $( "html" ).scrollTop();
      }else{
          scroll = $( "body" ).scrollTop();
      }*/
      scroll = $(window).scrollTop();

      //===========================================
      //console.log("scroll：" + scroll + "px");
      //===========================================

      ///以下何らかの処理

      //footerの高さ取得
      var pageID = $("body").attr("id"); //page-id取得

      if (pageID == "page-other") {
        var footer = $("#globalFooter"); //ストップ位置指定
      } else {
        var footer = $(".list_contents"); //ストップ位置指定
      }

      //var footer = $(".list_contents");//ストップ位置指定
      var footerTop = footer.position().top;

      var footerTop = footerTop;

      //.right_box || .left_box の上の要素の高さを取得
      var globalHeader_height = $("#globalHeader").outerHeight(true);
      var main_visual_height = $(".main_visual").outerHeight(true);
      var topicpath_height = $(".main_contents > .topicpath").outerHeight(true);
      var header_height = main_visual_height + topicpath_height + (globalHeader_height / 2);

      //scrollTop
      var scrollTop = $(this).scrollTop();

      //.right_boxの高さを取得
      var right_box_height = $(".pc .right_box").outerHeight(true);

      //.right_boxの高さを取得
      var left_box_height = $(".pc .left_box").outerHeight(true);

      //.side_boxの高さを取得
      var side_box_height = $(".tb.side_box").outerHeight(true);

      var scroll2 = parseInt(scroll) + parseInt(globalHeader_height);

      //===========================================
      // PC
      //===========================================

      // 振り分け
      if (right_box_height > left_box_height) {
        //var setTop = footerTop - $('.center_box').offset().top- right_box_height;
        var setTop = footerTop - right_box_height;
        scroll3 = scroll2 + right_box_height

        //if(  /*scroll < window_height - globalHeader_height ||*/ scroll < header_height ){
        if (scroll2 < $(".contents_wrapper").offset().top) {
          //.left_box
          $(".pc .left_box").css("position", "absolute");
          $(".pc .left_box").css("top", "0");

          //.right_box
          $(".pc .right_box").css("position", "absolute");
          $(".pc .right_box").css("top", "0");
        }
        //else if( scroll2 >= $(".contents_wrapper").offset().top)
        else if (scroll2 >= $(".contents_wrapper").offset().top && scroll3 < footerTop) {

          //.left_box
          $(".pc .left_box").css("position", "fixed");
          $(".pc .left_box").css("top", globalHeader_height + "px");

          //.right_box
          $(".pc .right_box").css("position", "fixed");
          $(".pc .right_box").css("top", globalHeader_height + "px");
        }
        //else if( scroll > (footerTop - right_box_height))
        else if (scroll3 >= footerTop) {
          setTop = parseInt($('.contents_wrapper').outerHeight()) - parseInt(right_box_height) + parseInt($('.main_contents').css('margin-bottom').replace('px', ''));

          //.left_box
          $(".pc .left_box").css("position", "absolute");
          $(".pc .left_box").css("top", setTop /*-50*/ + "px");

          //.right_box
          $(".pc .right_box").css("position", "absolute");
          $(".pc .right_box").css("top", setTop /*-50*/ + "px");
        }
      } else if (right_box_height < left_box_height) {
        //var setTop = footerTop - $('.center_box').offset().top- left_box_height;
        var setTop = footerTop - left_box_height;
        scroll3 = scroll2 + left_box_height

        //if(  /*scroll < window_height - globalHeader_height ||*/ scroll < header_height )
        if (scroll2 < $(".contents_wrapper").offset().top) {
          //.left_box
          $(".pc .left_box").css("position", "absolute");
          $(".pc .left_box").css("top", "0");

          //.right_box
          $(".pc .right_box").css("position", "absolute");
          $(".pc .right_box").css("top", "0");
        }
        //else if( scroll < (footerTop - left_box_height))
        else if (scroll2 >= $(".contents_wrapper").offset().top && scroll3 < footerTop) {

          //.left_box
          $(".pc .left_box").css("position", "fixed");
          $(".pc .left_box").css("top", globalHeader_height + "px");

          //.right_box
          $(".pc .right_box").css("position", "fixed");
          $(".pc .right_box").css("top", globalHeader_height + "px");
        } else if (scroll3 >= footerTop) {
          //.left_box
          setTop = parseInt($('.contents_wrapper').outerHeight()) - parseInt(left_box_height) + parseInt($('.main_contents').css('margin-bottom').replace('px', ''));

          $(".pc .left_box").css("position", "absolute");
          $(".pc .left_box").css("top", setTop /*-50*/ + "px");

          //.right_box
          $(".pc .right_box").css("position", "absolute");
          $(".pc .right_box").css("top", setTop /*-50*/ + "px");
        }
      }

      //===========================================
      // TB
      //===========================================
      //var header_height = main_visual_height + topicpath_height + (globalHeader_height / 2);
      var header_height = main_visual_height + topicpath_height - globalHeader_height;
      var scroll3 = scroll2 + side_box_height
      //if(  /*scroll < window_height - globalHeader_height ||*/ scroll < header_height ){
      if (scroll2 < $(".contents_wrapper").offset().top) {
        $(".tb.side_box").css("position", "absolute");
        $(".tb.side_box").css("top", "0px");
        //} else if( scroll < footerTop - side_box_height - 125) {
      } else if (scroll2 >= $(".contents_wrapper").offset().top && scroll3 < footerTop) {
        /*
        $( ".tb.side_box" ).css( "position" , "fixed" );
        $( ".tb.side_box" ).css( "top" , globalHeader_height+"px" );
        */
        //} else if( scroll > footerTop - side_box_height - 125) {
      } else if (scroll3 >= footerTop) {
        //var setTop = footerTop - scroll- side_box_height;
        //var setTop = footerTop - $('.center_box').offset().top- side_box_height;
        /*
        setTop = parseInt($('.contents_wrapper').outerHeight()) - parseInt(side_box_height)+parseInt($('.main_contents').css('margin-bottom').replace('px',''));

        $( ".tb.side_box" ).css( "position" , "absolute" );
        $( ".tb.side_box" ).css( "top" , setTop-25 /*-50* +"px" );
        */
      }
      $(".tb.side_box").css("position", "absolute");
      $(".tb.side_box").css("top", "0px");


      viewport();
    });
  }


  //viewport check
  var viewport = function () {
    if (viewportCheck.isSP()) {
      //console.log("SP")
      side_box.addClass("sp");
      side_box.removeClass("pc");
      side_box.removeClass("tb");

      $(".sp .right_box").css({
        position: "static"
      });
      $(".sp .left_box").css({
        position: "static"
      });
      $(".sp.side_box").css({
        position: "static"
      });

    } else if (viewportCheck.isTB()) {
      //console.log("TB")
      side_box.addClass("tb");
      side_box.removeClass("pc");
      side_box.removeClass("sp");

      $(".tb .right_box").css({
        position: "static"
      });
      $(".tb .left_box").css({
        position: "static"
      });

    } else if (viewportCheck.isPC()) {
      //console.log("PC")
      side_box.addClass("pc");
      side_box.removeClass("sp");
      side_box.removeClass("tb");

      $(".pc.side_box").css({
        position: "static"
      });
    }
  }



  //ウィンドウのリサイズが終わったタイミングで実行
  var timer = false;
  $(window).on('resize', function () {

    if ($('#globalNavi').hasClass('active')) {
      // グローバルナビオープン時
      if (viewportCheck.isSP() === false) {
        // PO版の時
        $('#globalNavi').attr("style", '');
        $('#globalFooter').removeClass("hide");
      } else {
        // SP版の時は処理不要
        $('#globalFooter').addClass("hide");
      }


    }
    //console.log('resized');

    //リサイズ時にclass消す
    $(".right_box").removeClass("absolute");
    $(".left_box").removeClass("absolute");
    $(".side_box").removeClass("absolute");
    $(".right_box").removeClass("fixed");
    $(".left_box").removeClass("fixed");
    $(".side_box").removeClass("fixed");

    $(".right_box").css({
      top: "0"
    });
    $(".left_box").css({
      top: "0"
    });
    $(".side_box").css({
      top: "0"
    });

    //実行
    viewport();

    $(window).trigger('scroll');
    //sidebar();
  });
  //ウィンドウのリサイズここまで

  $('#globalNaviInner').find('a').on('click', function () {
    $('.menu-trigger').trigger('click');
  })



});




//---------------------------------------------------------
//
//SNS LINEボタン
//
//---------------------------------------------------------

if (util.isAndroid || util.isTablet || util.isIOS) {
  $('.sns_line').addClass('sns_on');
  $('.sns_line').removeClass('sns_off');
} else {
  $('.sns_line').removeClass('sns_on');
  $('.sns_line').addClass('sns_off');
}


//---------------------------------------------------------
//
//アコーディオン
//
//---------------------------------------------------------

$(function () {
  $(".btn_unit_more a").on("click", function () {
    var elem = $(this).closest("ul").prev("div");
    parentElem = $(this).parent('li');
    childElem = $(this).closest("ul").children("li");
    reElemTop = $(this).closest('.unit_sec').offset().top - $('#globalHeader').outerHeight();
    elem.slideToggle();
    if (parentElem.hasClass('more_active') === true) {
      $("html, body").animate({
        scrollTop: reElemTop
      }, 400, "easeOutQuart");
    }
    childElem.toggleClass("more_active");
    childElem.toggleClass("more_off");
  });

  //SP用
  $(".sp_btn_unit_more a").on("click", function () {
    var elem = $(this).closest("ul").next("div");
    childElem = $(this).closest("ul").children("li");
    elem.slideToggle();
    childElem.toggleClass("more_active");
    childElem.toggleClass("more_off");
  });

  $(window).on('resize', function () {
    // グローバルナビオープン時
    if (viewportCheck.isSP() === false) {
      // PO版の時
      $('.sp_unit_more').attr("style", '');
    }
  });
});


$(function () {
  $(".faq_list dt").on("click", function () {
    $(this).next().stop(true, true).slideToggle();
    $(this).toggleClass("faq_open");
  });
});;
cjs = createjs;

cjs.Ticker.timingMode = cjs.Ticker.RAF;

var Mask = (function(){

  function Mask ($canvas){
    this.$canvas = $canvas;
    this.stage = new cjs.Stage($canvas[0]);
    this.bitmap = new cjs.Shape();
    this.mask = new cjs.Shape();

    this.canvasW = this.$canvas[0].width = this.$canvas.width();
    this.canvasH = this.$canvas[0].height = this.$canvas.height();

    this.stage.width = this.canvasW;
    this.stage.height = this.canvasH;

    this.isTween = false;

    this._init();
  }


  // prototype
  var p = Mask.prototype;


  // 初期化
  p._init = function(){
    // bitmap
    this.bitmap.graphics = new createjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, this.canvasW, this.canvasH);
    this.mask.graphics = new createjs.Graphics().beginFill("#000").drawCircle(0,0,0);

    // mask
    this.mask.compositeOperation = 'xor';

    // addChild
    this.stage.addChild(this.bitmap, this.mask);


    var self = this;
    // ticker
    cjs.Ticker.on('tick', function(){
      self.stage.update();
    });
  };


  p.resize = function(parent){
    this.canvasW = this.$canvas[0].width = parent.width();
    this.canvasH = this.$canvas[0].height = parent.height();
    this.bitmap.graphics = new createjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, this.canvasW, this.canvasH);
  };


  // tween
  p.tween = function(target){
    if(!this.isTween){
      this.isTween = true;
      var _self = this;
      var speed = 2000;

      this.resize(target);

      var mask = this.mask,
      cx = this.canvasW / 2,
      cy = this.canvasH / 2,
      r = ~~Math.sqrt(Math.pow(cx, 2) + Math.pow(cy, 2)) + 10;

      mask._count = 0;

      var onComplete = function(){
        $(_self.$canvas).hide();
      };

      setTimeout(function(){
        _self.$canvas.addClass('transparent');
      }, 100);


      var _parent = _self.$canvas.parents('.img');
      var _hideTxt = _parent.next('.hide_txt');
      setTimeout(function(){
        _hideTxt.addClass('active');
      }, speed - 600);

      cjs.Tween.get(mask)
        .wait(200)
        .to({_count: 1}, speed)
        .call(onComplete)
        .on('change', function(a, b, c){
          mask.graphics.clear();
          mask.graphics.beginFill("#000").drawCircle(cx, cy, r * cjs.Ease.quartOut(mask._count));
        });
    }
  };


  // return class
  return Mask;
}());




/*********************************************************************************************/
// 画像の読み込み
/*********************************************************************************************/
var loadImg = (function(){
  var _targetImg;
  var _window;
  var _mask;
  var masks = [];
  var _canvas = $('canvas');

  var init = function(){
    _targetImg = $('.replace');
    _window = $(window);
    _mask = $('.mask');
    _canvas = $('canvas');
    var completeFlag = false;

    // 画面サイズで読み込む画像を変更
    // _targetImg.breakpoint();


    // 画像の読み込みが終わったらコールバックする
    var loadImgAction = function(){
      var d = new $.Deferred();
      var loaded = 0;
      var max = _targetImg.length;

      _targetImg.each(function() {
        var targetObj = new Image();
        $(targetObj).on('load', function(){
          loaded++;
          if (loaded == max){
            d.resolve();
          }
        });
        targetObj.src = this.src;
      });

      return d.promise();
    };

    loadImgAction().done(function() {

		setTimeout(function(){
			$('#btnMenu').find('.ic').addClass('animation');
			$('#btnMenu').find('.menu_mask').addClass('animation');
			canvasAction();
		}, 800);


      completeFlag = true;
    });

    $(window).on('scroll', function(){
      if(completeFlag === false) return;
      canvasAction();
    });
  };


  var canvasLength = _canvas.length;
  for(var i=0; i<canvasLength; i++){
    var _this = _canvas.eq(i);
    var _parent = _this.parent('.mask');

    masks.push(new Mask(_this));
  }


  var canvasOnceFlag = false;
  var canvasAction = function(){
    var _window = $(window);
    var _mask = $('.mask');
    var scrollTop = _window.scrollTop();
    var windowH = _window.height();

    _mask.each(function(i){
      var target = $(this);
      var _canvas = target.find('canvas');

      if(_canvas.css('display') === 'none'){
        return true;
      }
      else {
        var in_position;
        if(!canvasOnceFlag){
          in_position = target.offset().top;
        }
        else {
          in_position = target.offset().top + (windowH/4);
        }
        var window_bottom_position = scrollTop + windowH;
        if(in_position < window_bottom_position){
          masks[i].tween(target);
        }
      }
    });

    canvasOnceFlag = true;
  };


  $(init);
})();
/*********************************************************************************************/
;

