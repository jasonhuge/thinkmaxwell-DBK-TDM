/*GENERIC  VIEW CONTROLLER*/
(function(window){
	HeaderViewController.prototype = new BaseViewController();
	HeaderViewController.prototype.constructor = HeaderViewController;
	
	function HeaderViewController(){
		this._view;
		this._activeTitle;
		this._playClosure;
		this._top = 18
		
		this.update = function(step, sandwichThumb) {
			var prevTitle = this._activeTitle;
			var title = "";
			
			title = step.title
						
			var transitionalLabel = $(this._view.find(".transitional-title"));
			transitionalLabel.css({opacity: 1});
			transitionalLabel.html(prevTitle);
			
			var titleLabel = $(this._view.find(".title"));
			titleLabel.css({opacity: 0});
			titleLabel.html(title);
			
			var sandoThumb = $(this._view.find("#sando-thumb"));
						
			if (sandwichThumb !== null) {
				sandoThumb.html('<img src="'+sandwichThumb+'"/>');
				TweenMax.to(sandoThumb, 0.25, {css:{opacity:1}, ease:Sine.easeIn});
			} else {
				TweenMax.to(sandoThumb, 0.25, {css:{opacity:0}, ease:Sine.easeIn});
			}
						
			TweenMax.to(transitionalLabel, 0.25, {css:{opacity:0}, ease:Sine.easeIn});
			TweenMax.to(titleLabel, 0.25, {css:{opacity:1}, ease:Sine.easeIn});
			
			this._activeTitle = title;
		}
		
		this.setup = function() {
			
		}
		
		this.intro = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;			
			TweenMax.to(this._view, duration, {css:{opacity:1, top: this._top, hidden: false}, ease:Sine.easeIn});
		}
		
		this.exit = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;
			var top = -(this._view.height() / 4);
			TweenMax.to(this._view, duration, {css:{opacity:0, top: top, hidden: true}, ease:Sine.easeIn});
		}
		
		this.baseSetup = function(target) {
			this._view = $(target);
			this.setup();
			this.exit(false);
		}
	}

	window.HeaderViewController = HeaderViewController;
}(window));