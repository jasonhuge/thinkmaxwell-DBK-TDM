/*GENERIC  VIEW CONTROLLER*/
(function(window){
	GameViewController.prototype = new BaseViewController();
	GameViewController.prototype.constructor = GameViewController;
	
	function GameViewController(){
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
	
	
	window.GameViewController = GameViewController;
}(window));