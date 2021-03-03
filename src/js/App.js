
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function App(){
		
		this._deviceType;
		this._preloader;
		this._model;
		
		this._header;
		this._footer;
		
		this._introCoordinator;
		this._gameCoordinator;
		
		this.loadScripts = function(e){
			var context = this;
			
			$.getScript("https://code.createjs.com/preloadjs-0.6.2.min.js", function(){
				$.getScript("https://code.createjs.com/createjs-2015.11.26.min.js", function(){
					context.loadModel();
				});
			});
			
		};
		
		this.loadModel = function() {
			var context = this;
			$.ajax({
				url: "data/app.json",
				type: "GET",
				dataType: "json",
				success: function(response) {
					context._model = response;
					context.setup();
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
				
		this.setup = function() {
			var context = this;
			
			this._header = new HeaderViewController();
			this._header.init($("#app-header"))
			
			this._footer = new FooterViewController();
			this._footer.init($("#app-footer"));
			
			this._footer.didSelectNextButton = function() {
				context._gameCoordinator.presentNextViewController();
			}
			
			this._footer.didSelectBackButton = function() {
				context._gameCoordinator.presentPrevViewController();
			}
			
			this._footer.didSelectHomeButton = function() {
				context._gameCoordinator.exit();
			}
		
			this._introCoordinator = new IntroCoordinator();
			this._introCoordinator.init(this._model.intro, $("#intro-container"));
			
			var gameViewModel = new GameViewModel();
			gameViewModel.init(this._model.game);
			
			this._gameCoordinator = new GameCoordinator();
			this._gameCoordinator.init(gameViewModel, $("#game-container"));
			
			this._gameCoordinator.exitBegan = function() {
				context.hideNavigation();
			}
			
			this._gameCoordinator.exitComplete = function() {
				context._gameCoordinator.reset();
				context._introCoordinator.intro();
			}
			
			this._gameCoordinator.shouldNavigateToStep = function(headerData, footerData) {
				context._header.update(headerData);
				context._footer.update(footerData);
			}
			
			this._introCoordinator.exitComplete = function() {
				context._gameCoordinator.intro();
				context.showNavigation();
			}

			this.loadContent();
		}
		
		this.showNavigation = function() {
			this._header.intro(true);
			this._footer.intro(true);
		}
		
		this.hideNavigation = function() {
			this._header.exit(true);
			this._footer.exit(true);
		}
	
		this.loadContent = function(){
    		var context = this;
    		var gameImages = this._gameCoordinator.gameImages();
    		
			this._preloader = new PreloadViewController();
			this._preloader.init($(".preloader"));
			
            $(this._preloader).on("onExitComplete", function(e){ context.onPreloaderExitComplete(e); });
             
			this._preloader.intro(function() {
				context._preloader.loadContent(gameImages, function(e){
					context.onLoadContentComplete(e);
					
					context._preloader.exit(function(e) {
						context.intro();
					});
				});
			});
		};
				
		this.onLoadContentComplete = function(e){    		
    		this.onWindowResize();
			           
        };
		
		this.onPreloaderExitComplete = function(e){
    		this._intro();
		};
		
		this.intro = function(){
			this._introCoordinator.intro();
		};
		
		this.onOrientationChange = function(e){	
    		var context = this;
    		if (window.orientation === 90 || window.orientation === -90) {
	    		$(".rotate-message").css({"display": "block"});
    		} else {
	    		$(".rotate-message").css({"display": "none"});
    		}
    		
    		if (this._introCoordinator && this._gameCoordinator) {
	    		this._introCoordinator.onOrientationChange(orientation);
				this._gameCoordinator.onOrientationChange(orientation);
    		}
		};
				
		this.onWindowResize = function(e){
			console.log("resize");
			this._gameCoordinator.onWindowResize(e);
   		}
	}
	
	App.prototype = {
		init:function(deviceType){
			this._deviceType = deviceType;
			
			var context = this;
				
			$(window).on("orientationchange", function(e){ context.onOrientationChange(e); });
			$(window).on("resize", function(e){ context.onWindowResize(e); });
			
			
																							
			this.loadScripts();
			
			this.onOrientationChange();
			
			$(".terms-conditions .close-button").on("click", function() {
				TweenMax.to($(".terms-conditions"), 0.25, {autoAlpha: 0});
			});
			
			if (deviceType !== "ios") {
				var windowHeight = $(window).innerHeight();
				$('body').css({'height':windowHeight});
			
				if('visualViewport' in window) {
					window.visualViewport.addEventListener('resize', function(event) {
						var keyboardShowing = (event.target.height < $(document).height()) ? true : false
						context._gameCoordinator.onKeyboardChange(keyboardShowing, event.target.height);
					});
				}
			}
		}
	};
	
	window.App = App;
}(window));

