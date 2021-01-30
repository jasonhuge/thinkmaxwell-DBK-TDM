/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseLevelViewController.prototype = new BaseViewController();
	ChooseLevelViewController.prototype.constructor = ChooseLevelViewController;
	
	function ChooseLevelViewController(){
		this._view;
		this._container;
		this._model;
		this.selectLevelListener;
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><ul></ul></div></div>';
			
			this._container.append(template);
			
			this._view = $("#" + pageId);
			
		}
		
		this.setupLevels = function(levels) {
			var context = this;
			var content = $(this._view.find("ul"));
			
			levels.forEach(function(level) {
				var template = '<li class="level"><div class="level-content"><h3>' + level.desc + '</h3><div class="level-button button" data-id="' + level.id + '">' + level.title + '<img src="img/content/level-select-arrow.png" alt=""/></div></div></li>';
				content.append(template);
			});
			
			$(this._view.find(".level-button")).on("click", function() {
				context.selectLevelListener($(this).data("id"));
			})
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
	}
	
	
	window.ChooseLevelViewController = ChooseLevelViewController;
}(window));