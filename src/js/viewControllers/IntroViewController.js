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