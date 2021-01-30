
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function App(){
		
		this._deviceType;
		this._preloader;
		this._data;
		this._game;
		
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
			
			var header = new HeaderViewController();
			header.init($("#app-header"));
			
			var footer = new FooterViewController();
			footer.init($("#app-footer"));
			
			$(".page-slider").find(".page").each(function(){
				if ($(this).is("#intro") === false) {
					var headerHeight = header._view.outerHeight() + header._top;
					var footerHeight = header._view.outerHeight();
					var containerHeight = $(".page-container").height() - headerHeight - footerHeight;
					console.log(containerHeight);
					$(this).css({
						"margin-top": headerHeight,
						"height": containerHeight
					});
					/*$(this).css({
						"padding-top": headerHeight,
						"padding-bottom": footerHeight
					});*/
				}
			});
    		
    		this._game = new GameCoordinator();
    		this._game.init($(".page-container"), this._deviceType, header, footer);
    	    		    		
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

