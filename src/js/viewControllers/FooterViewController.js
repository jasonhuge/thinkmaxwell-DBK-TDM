/*GENERIC  VIEW CONTROLLER*/
(function(window){
	FooterViewController.prototype = new BaseViewController();
	FooterViewController.prototype.constructor = FooterViewController;
	
	function FooterViewController(){
		this._view;
		this._backButton;
		this._nextButton;
		
		this.didSelectNextButton;
		this.didSelectBackButton;
		
		this.update = function(data) {
			var back = data.back;
			var next = data.next;
			
			if (back) {
				$(this._backButton.find("h4")).text(back.title);
				TweenMax.to(this._backButton, 0.25, {autoAlpha: 1});
			} else {
				TweenMax.to(this._backButton, 0.25, {autoAlpha: 0});
			}
			 
			if (next) {
			 	$(this._nextButton.find("h4")).text(next.title);
			 	TweenMax.to(this._nextButton, 0.25, {autoAlpha: 1});
			} else {
			 	TweenMax.to(this._nextButton, 0.25, {autoAlpha: 0});
			}
		}
		
		this.setup = function() {  
			
			var context = this;
			
			this._backButton = $(this._view.find("#back-button"));
			this._nextButton = $(this._view.find("#spacer-button"));
			
			this._backButton.on("click", function() {
				context.didSelectBackButton();
			});
			
			this._nextButton.on("click", function() {
				console.log("did select next");
				context.didSelectNextButton();
			});
		}
		
		this.intro = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;			
			TweenMax.to(this._view, duration, {css:{opacity:1, bottom: 0, hidden: false}, ease:Sine.easeIn});
		}
		
		this.exit = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;
			var bottom = -(this._view.height() / 4);
			TweenMax.to(this._view, duration, {css:{opacity:0, bottom: bottom, hidden: true}, ease:Sine.easeIn});
		}	
			
		this.baseSetup = function(target, nextListener, backListener) {
			this._view = $(target);
			this._nextListener = nextListener;
			this._backListener = backListener;
			this.setup();
			this.exit(false);
		}
	}

	window.FooterViewController = FooterViewController;
}(window));