/*GENERIC  VIEW CONTROLLER*/
(function(window){
	FooterViewController.prototype = new BaseViewController();
	FooterViewController.prototype.constructor = FooterViewController;
	
	function FooterViewController(){
		this._view;
		
		this.nextClosure;
		this.backClosure;
		
		this.update = function(step) {
			
		}
		
		this.setup = function() {
			var context = this;
			$(this._view.find("#back-button")).on("click", function() {
				context.backClosure();
			});
			
			$(this._view.find("#next-button")).on("click", function() {
				context.nextClosure();
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