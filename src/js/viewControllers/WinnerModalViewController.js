/*GENERIC  VIEW CONTROLLER*/
(function(window){
	WinnerModalViewController.prototype = new BaseViewController();
	WinnerModalViewController.prototype.constructor = WinnerModalViewController;
	
	function WinnerModalViewController(){
		this._view;
		this._container;
		this.selectNextListener;
		
		this.setup = function() {
			var context = this;
			this._container.empty();
			this._container.load("templates/winner-modal.html", function() {
				context.onLoad();
			});
		}
		
		this.onLoad = function() {
			var context = this;
			this._view = $(this._container.find(".winner"));
			this._view.find("#winner-next-button").on("click", function() {
				context.selectNextListener();
				context.exit();
			});
		}
			
		this.init = function(container) {
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			console.log("winner in ", this._container);
			TweenMax.to(this._container, 0.25, {autoAlpha: 1, onComplete: function(){
				console.log("intro complete");
			}});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._container, 0.25, {autoAlpha: 0, onComplete: function() {
				context._container.empty();
			}});
		}
	}
	
	
	window.WinnerModalViewController = WinnerModalViewController;
}(window));