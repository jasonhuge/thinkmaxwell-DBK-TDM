/*GENERIC  VIEW CONTROLLER*/
(function(window){
	HeaderViewController.prototype = new BaseViewController();
	HeaderViewController.prototype.constructor = HeaderViewController;
	
	function HeaderViewController(){
		this._view;
		this._playClosure;
		
		this.setup = function() {
			
		}
		
		this.intro = function() {
			this._view.css("opacity", 1);
		}
		
		this.baseSetup = function(target) {
			this._view = $(target);
			this.setup();
		}
	}

	window.HeaderViewController = HeaderViewController;
}(window));