/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseLevelViewController.prototype = new BaseViewController();
	ChooseLevelViewController.prototype.constructor = ChooseLevelViewController;
	
	function ChooseLevelViewController(){
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
	
	
	window.ChooseLevelViewController = ChooseLevelViewController;
}(window));