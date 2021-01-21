/*GENERIC  VIEW CONTROLLER*/
(function(window){
	HowToViewController.prototype = new BaseViewController();
	HowToViewController.prototype.constructor = HowToViewController;
	
	function HowToViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
	}
	
	
	window.HowToViewController = HowToViewController;
}(window));