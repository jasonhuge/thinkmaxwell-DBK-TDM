(function(window){
	InstructionsViewController.prototype = new BaseViewController();
	InstructionsViewController.prototype.constructor = InstructionsViewController;
	
	function InstructionsViewController(){
		this._view;
		this._container;
		this._model;
		
		this.setup = function() {
			var pageId = this._model['page-id'];			
			this._container.append(this._model.template);	
			this._view = $("#" + pageId);	
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			TweenMax.to(this._view, 0.25, {autoAlpha: 1});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._view, 0.25, {autoAlpha: 0, onComplete: function() {
				if (completion) { completion(); }
			}});
		}
	}
	
	
	window.InstructionsViewController = InstructionsViewController;
}(window));