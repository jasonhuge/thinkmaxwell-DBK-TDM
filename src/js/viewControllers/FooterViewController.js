/*GENERIC  VIEW CONTROLLER*/
(function(window){
	FooterViewController.prototype = new BaseViewController();
	FooterViewController.prototype.constructor = FooterViewController;
	
	function FooterViewController(){
		this._view;
		
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

	window.FooterViewController = FooterViewController;
}(window));