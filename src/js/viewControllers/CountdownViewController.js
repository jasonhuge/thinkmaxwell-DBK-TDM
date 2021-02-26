/*GENERIC  VIEW CONTROLLER*/
(function(window){
	CountdownViewController.prototype = new BaseViewController();
	CountdownViewController.prototype.constructor = CountdownViewController;
	
	function CountdownViewController(){
		this._view;
		this.onIntroComplete;
		this.onExitComplete;
		this._numbers = [];
		this._index = 0;
		
		this.intro = function() {
			var context = this;
			this._view.css({
				"opacity": 0,
				"display": "block"
			})
			TweenMax.to(this._view, 0.25, {alpha: 1, onComplete:function(){ 
				context.onIntroComplete();
				context.countdown();
			}});
		}	
		
		this.exit = function() {
			var context = this;
			TweenMax.to(this._view, 0.25, {alpha: 0, onComplete:function(){ 
				context._view.css({"display": "none"});
			}});
		}
		
		this.countdown = function() {
			var context = this;
			var tl = new TimelineMax({onComplete: function() {
				context.exit();
			}});

			tl.to($("#count-three"), 0.25, {alpha: 1});
			tl.to($("#count-three"), 0.25, {alpha: 0},"+=0.75");
			tl.to($("#count-two"), 0.25, {alpha: 1});
			tl.to($("#count-two"), 0.25, {alpha: 0},"+=0.75");
			tl.to($("#count-one"), 0.25, {alpha: 1});
			tl.to($("#count-one"), 0.25, {alpha: 0},"+=0.75");
		}	
		
		this.setup = function() {
			var context = this;
			this._view.find("li").each(function() {
				var number = $(this);
				context._numbers.push(number);
			});
			
			this._numbers.reverse();
		}
		
		this.init = function(view) {
			this._view = view;
			this.setup();
		}
	}
	
	
	window.CountdownViewController = CountdownViewController;
}(window));