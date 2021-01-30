/*GENERIC  VIEW CONTROLLER*/
(function(window){
	IntroViewController.prototype = new BaseViewController();
	IntroViewController.prototype.constructor = IntroViewController;
	
	function IntroViewController(){
		this._view;
		this.playButtonListener;
		this._model;
		this._container;
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><div class="hero-title"><img src="img/content/home-hero.png" alt="Total Day Maker"/></div><div class="hero-content"><div class="logo"><img src="img/content/daves-logo.png" alt="Daves Bread"/></div><!------><div class="play-button"><img src="img/content/home-play-btn.png" alt="Play for Bread"/></div></div><div class="terms"><a href="">TERMS AND CONDITIONS</a></div></div></div>';
			
			this._container.append(template);
			
			this._view = $("#" + pageId);
			
			
			$(this._view.find(".play-button")).on("click", function() {
				context.playButtonListener();
			});
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
	}

	window.IntroViewController = IntroViewController;
}(window));