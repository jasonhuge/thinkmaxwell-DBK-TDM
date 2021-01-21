/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseSandwichViewController.prototype = new BaseViewController();
	ChooseSandwichViewController.prototype.constructor = ChooseSandwichViewController;
	
	function ChooseSandwichViewController(){
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
	
	
	window.ChooseSandwichViewController = ChooseSandwichViewController;
}(window));