
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function App(){
		
		this._deviceType;
		this._preloader;
		this._data;
		this._game;
		this._header;
		this._footer;
		
		this.loadScripts = function(e){
			var context = this;
			
			$.getScript("https://code.createjs.com/preloadjs-0.6.2.min.js", function(){
				$.getScript("https://code.createjs.com/createjs-2015.11.26.min.js", function(){
					context.loadGame();
				});
			});
			
		};
		
		this.loadGame = function() {
			var context = this;
			
			this._header = new HeaderViewController();
			this._header.init($("#app-header"));
			
			this._footer = new FooterViewController();
			this._footer.init($("#app-footer"));
			
			
			$(".page-slider").find(".page").each(function(){
				if ($(this).is("#intro") === false) {
					var headerHeight = context._header._view.height();
					var footerHeight = context._header._view.height();
					$(this).css({
						"padding-top": headerHeight,
						"padding-bottom": footerHeight
					}); 
				}
			});
    		
    		this._game = new GameCoordinator();
    		this._game.init($(".page-container"), this._deviceType);
    		
    		this._game._presentNavigationClosure = function() {
	    		context._header.intro();
	    		context._footer.intro();
    		}
    		
    		this._game._hideNavigationClosure = function() {
	    		context._header.exit();
	    		context._footer.exit();
    		}
    		    		
    		this._game.load(function() {
	    		context.loadContent();
    		});
		}

		this.loadContent = function(){
    		var context = this;
    		
			this._preloader = new PreloadViewController();
			this._preloader.init($(".preloader"));
			
            $(this._preloader).on("onExitComplete", function(e){ context.onPreloaderExitComplete(e); });
             
			this._preloader.intro(function() {
				context._preloader.loadContent(context._game.gameImages(), function(e){
					context._preloader.exit(function(e) {
						//context.onLoadContentComplete(e);
					});
				});
			});
		};
				
		this.onLoadContentComplete = function(e){
    		console.log("I have it all now i can start");
    		
    		this.onWindowResize();
			           
        };
		
		this.onPreloaderExitComplete = function(e){
    		console.log("preloader exit complete");
		};
		
		this.intro = function(){
			
		};
		
		this.onOrientationChange = function(e){	
    		var context = this;
    		
		};
				
		this.onWindowResize = function(){
			
   		}
	}
	
	App.prototype = {
		init:function(deviceType){
			
			this._deviceType = deviceType;
			
			var context = this;
	
			$(window).on("orientationchange", function(e){ context.onOrientationChange(e); });
			$(window).on("resize", function(e){ context.onWindowResize(e); });
																							
			this.loadScripts();
	
		}
	};
	
	window.App = App;
}(window));

$(document).ready(function(){
	
	var mobileDetect =  new MobileDetect(window.navigator.userAgent);
	
	var deviceType;
		
	if(mobileDetect.phone()){
		deviceType = "phone";

	}else{
		
		if(mobileDetect.tablet()) {
			deviceType = "tablet"
		}else{
			deviceType = "desktop";
		}
		
		$(".wrapper").addClass("desktop");
	}
	
	var outOfDate = false;
	
	if(deviceType === "desktop"){
		if(bowser.safari){
			if(bowser.version < 6){
				outOfDate = true;
			}
		}else if(bowser.firefox){
			if(bowser.version < 45){
				outOfDate = true;
			}
			
		}else if(bowser.chrome){
			if(bowser.version < 49){
				outOfDate = true;
			}
			
		}else if(bowser.msie){
    		$(".content").css("overflow", "auto");
			if(bowser.version < 10){
				outOfDate = true;
			}
		}
	}
	
	/*$("#tsparticles")
	.particles()
	.ajax("data/particles.json", function (container) {
		console.log(container);
    // container is the particles container where you can play/pause or stop/start.
    // the container is already started, you don't need to start it manually.
  	});*/
	
    /*if(deviceType === "desktop") {
        $(".rotate-message").remove();
    } else if (deviceType === "tablet") {
        //$(".rotate-message").addClass("rotate-tablet");
         $(".rotate-message").remove();
    } else if (deviceType === "phone") {
        $(".rotate-message").addClass("rotate-phone"); 
    }*/
				
	/*if(outOfDate){
		if(bowser.msie && bowser.version < 9){
			$("#ood").css("display", "block");
		}else{
			$("#broswer-ood").css("display", "block");
		}
				
		return;
		
	}*/

	var app = new App();
	app.init(deviceType);

});

// Avoid `console` errors in browsers that lack a console.


(function() {
	"use strict";
	
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*GENERIC  VIEW CONTROLLER*/
(function(window){
	
	function BaseViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.onCloseButtonClick = function(e){
			this.exit();
		}
		
		this.intro = function(){
			this._view.css({"opacity" : 1});
		}
		
		this.onIntroComplete = function(){
			$(this).trigger("onIntroComplete");
		}
		
		this.exit = function(){
			this._view.css({"opacity" : 0});
		}
		
		this.onExitComplete = function(){
			$(this).trigger("onExitComplete");
		}
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
		
	}
	BaseViewController.prototype = {
		init:function(target, model, deviceType){
			this.baseSetup(target, model, deviceType);
		},
		setTitle:function(title){
			
		},
		onWindowResize:function(e){
			
		},
		dealloc:function(){
			if(this._pageContent){
				this._pageContent.remove();
			}
			
			this._pageContent = null;
			this._view = null;
			this._deviceType = null;
			this._model = null;
		},
		removeFromParent:function(){
			this._view.remove();
			this._view = null;
		},
		snapIn:function(){
			this._view.show();
		},
		snapOut:function(){
			this._view.hide();
		},
		pause:function(){
			
		},
		updateOnNavigationEvent:function(vars){
			
		}
		
	}
	
	window.BaseViewController = BaseViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseLevelViewController.prototype = new BaseViewController();
	ChooseLevelViewController.prototype.constructor = ChooseLevelViewController;
	
	function ChooseLevelViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
	}
	
	
	window.ChooseLevelViewController = ChooseLevelViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseSandwichViewController.prototype = new BaseViewController();
	ChooseSandwichViewController.prototype.constructor = ChooseSandwichViewController;
	
	function ChooseSandwichViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
	}
	
	
	window.ChooseSandwichViewController = ChooseSandwichViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	FooterViewController.prototype = new BaseViewController();
	FooterViewController.prototype.constructor = FooterViewController;
	
	function FooterViewController(){
		this._view;
		
		this.setup = function() {
			
		}
		
		this.intro = function() {
			this._view.css("opacity", 1);
		}
		
		this.baseSetup = function(target) {
			this._view = $(target);
			this.setup();
		}
	}

	window.FooterViewController = FooterViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function GameCoordinator(){
		this._view;
		this._slider;
		
		this._deviceType;
		this._model;
		
		this._viewControllers;
		this._currentStep;
		
		this._presentNavigationClosure;
		this._hideNavigationClosure;
	
		this.setup = function() {
			var context = this;
			
			this._slider = $(this._view.find(".page-slider"));
			this._currentStep = 0;
			
			var intro = new IntroViewController();
			intro.init($(this._view.find("#intro")), function() {
				context.onNextButtonTap();
			});
			
			var howTo = new HowToViewController();
			howTo.init($(this._view.find("#how-to")), this._deviceType);
			
			var chooseLevel = new ChooseLevelViewController();
			chooseLevel.init($(this._view.find("#choose-level")), this._deviceType);
			
			var chooseSandwich = new ChooseSandwichViewController();
			chooseSandwich.init($(this._view.find("#choose-sandwich")), this._deviceType);
			
			var game = new GameViewController();
			game.init($(this._view.find("#game-play")), this._deviceType);
			
			this._viewControllers = [
				intro,
				howTo,
				chooseLevel,
				chooseSandwich,
				game
			];
			
		}
		
		this.onNextButtonTap = function() {
			if (this._currentStep == this._viewControllers.count - 1) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep ++;
			
			var vc = this._viewControllers[this._currentStep];
			
			var left = -(this._view.width() * this._currentStep);
			
			console.log(this._view)
			
			vc.intro();
			
			if (this._currentStep > 0) {
				this._presentNavigationClosure();
			}
			
			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.onBackButtonTap = function() {
			if (this._currentStep == 0) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep --;
			
			var vc = this._viewControllers[this._currentStep];
			
			vc.exit();
			
			var left = -(this._view.width() * this._currentStep);
			
			if (this._currentStep == 0) {
				this._hideNavigationClosure();s
			}
			
			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.onStartOverButtonTap = function() {
			
		}
		
		this.reset = function() {
			
		}

		this.loadJSON = function(completion) {
			var context = this;
			
			$.ajax({
				url: "data/app.json",
				type: "GET",
				dataType: "json",
				success: function(response) {
					context._model = response;
					context.loadStats(completion);
				}
			});
		}
		
		this.loadStats = function(completion) {
			var context = this;
			var game = this._model.game;
			var loadCount = game.levels.length;
			
			game.levels.forEach(function(level){
				if (level.max_num_participants != null) {
					$.ajax({
						url: "api/stats/index.php",
						data: {
							'id': level.list_id
						},
						type: "GET",
						dataType: "json",
						success: function(response) {
							level.stats = response.stats;
							loadCount -= 1;
							if (loadCount === 0) {
								context.loadCookies(completion);
							}
						},
						error: function (request, error) {
							//console.log("failed", request, error);
    					}
					});
				} else {
					loadCount -= 1;
				}
			});
		}
		
		this.loadCookies = function(completion) {
			var game = this._model.game;
			
			game.levels.forEach(function(level) {
				var name = level.id + "_completed";
				level.completed = $.cookie(name) ?? false;
			});
			
			completion();
		}
	}
	
	GameCoordinator.prototype = {
		init:function(target, deviceType){
			this._view = $(target);
			this._deviceType = deviceType;
			this.setup();
		},
		load: function(completion) {
			this.loadJSON(completion);
		},
		gameImages: function() {
			if (this._model == null) { return; }
			
			var game = this._model.game;
			var images = [];
			
			game.sandwiches.forEach(function(sandwich){
				images.push(sandwich.thumbnail);
				images.push(sandwich.top);
				images.push(sandwich.middle);
				images.push(sandwich.bottom);
			});
			
			return images;
		},
		onWindowResize:function(e){
			
		},
		dealloc:function(){
			this._view = null;
			this._deviceType = null;
			this._model = null;
		}
	}
	
	window.GameCoordinator = GameCoordinator;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	GameViewController.prototype = new BaseViewController();
	GameViewController.prototype.constructor = GameViewController;
	
	function GameViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
	}
	
	
	window.GameViewController = GameViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	HeaderViewController.prototype = new BaseViewController();
	HeaderViewController.prototype.constructor = HeaderViewController;
	
	function HeaderViewController(){
		this._view;
		this._playClosure;
		
		this.setup = function() {
			
		}
		
		this.intro = function() {
			this._view.css("opacity", 1);
		}
		
		this.baseSetup = function(target) {
			this._view = $(target);
			this.setup();
		}
	}

	window.HeaderViewController = HeaderViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	HowToViewController.prototype = new BaseViewController();
	HowToViewController.prototype.constructor = HowToViewController;
	
	function HowToViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
	}
	
	
	window.HowToViewController = HowToViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	IntroViewController.prototype = new BaseViewController();
	IntroViewController.prototype.constructor = IntroViewController;
	
	function IntroViewController(){
		this._view;
		this._playClosure;
		
		this.setup = function() {
			var context = this;
			$(this._view.find(".play-button")).on("click", function() {
				context._playClosure();
			});
		}
		
		this.baseSetup = function(target, playClosure) {
			this._view = $(target);
			this._playClosure = playClosure;
			this.setup();
		}
	}

	window.IntroViewController = IntroViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	PreloadViewController.prototype = new BaseViewController();
	PreloadViewController.prototype.constructor = PreloadViewController;
	
	function PreloadViewController(){
		
		this._loader;
		
		this.onImageLoadError = function(e){
			console.log(e);
		}
		
		this.onLoadCompleteReady = function(){
				
		}
		
		this.onImageLoadProgress = function(e){	
			
			console.log("progress", e.loaded * 100);
			var percentage = Math.round(e.loaded * 100);
			
			var loader = $(this._view.find(".preloader-sprite"));
			
			loader.html("loading " + percentage + "%");
			/*var percentage = Math.round(e.loaded * 100);
			
			var clipHeight = 282 - ( 282 * ( percentage / 100 ));
			
			var loaderBar = $(this._view.find(".loader-bar"));
			var loaderPercentage = $(this._view.find(".loader-percentage"));
			var loaderTitle = loaderPercentage.attr("data-title");
					
			loaderBar.css( {clip: "rect(" + clipHeight +"px 282px " + 0 + "282px 0)"});
			
			loaderPercentage.html(loaderTitle + " " + percentage + "%");*/
			
		}
		
		this.onExitComplete = function(){
    		this._view.remove();
		}
	}
	
	PreloadViewController.prototype = {
		init: function(target) {
			this._view = target;
		},
		intro: function(completion) {
			var context = this;
		
			completion();
		},
		exit: function(completion) {
			var context = this;
					
			TweenMax.to(this._view, 0.25, {alpha: 0, delay:0, onComplete:function(){ 
				context.onExitComplete();
				completion();
			}});
		},
		loadContent: function(additionalImages, completion) {
			var context = this;
			
			var images = $("body").find("img");
			var imageArray = [];
			var i;
			
			imageArray.concat(additionalImages);
		
			for(i = 0; i < images.length; i++){
				var image = images[i];
				
				imageArray.push($(images[i]).attr("src"));
			}
			
			var bgImages = [ ];
			var imageUrl;
			
			$("*:not(span,p,h1,h2,h3,h4,h5)").filter(function(){
				if( $(this).css("background-image") != "none" ){
					imageUrl = $(this).css("background-image").replace("url(", "");
					imageUrl = imageUrl.replace(")", "");
					imageUrl = imageUrl.replace('"', "");
					imageUrl = imageUrl.replace('"', "");
										
					if(imageUrl != undefined){
						if( imageUrl.search(".png") == -1 && imageUrl.search(".jpg") == -1 && imageUrl.search(".gif") == -1 ){
						
						}else{
							if(  imageUrl.search("base64") == -1 ){
								if( imageArray.indexOf(imageUrl) == -1 ){
	
									imageArray.push(imageUrl);
								}
							}
						}
					}
					
				}
			});
						
			imageArray = imageArray.filter(function(element){
				return element !== undefined;
			});
			
			if (imageArray.length === 0) {
				completion();
				return;
			}								
			
			this._loader = new createjs.LoadQueue(false);
			
			this._loader.addEventListener("complete",function(e){ completion(e) });
			this._loader.addEventListener("error",function(e){ context.onImageLoadError(e) });
			this._loader.addEventListener("progress",function(e){ context.onImageLoadProgress(e) });
			
			this._loader.loadManifest(imageArray);
			this._hasLoadStart = true;
		}
	}
	
	window.PreloadViewController = PreloadViewController;
}(window));