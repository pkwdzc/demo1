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
