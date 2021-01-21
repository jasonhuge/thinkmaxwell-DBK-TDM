
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
