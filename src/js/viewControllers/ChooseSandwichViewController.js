/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseSandwichViewController.prototype = new BaseViewController();
	ChooseSandwichViewController.prototype.constructor = ChooseSandwichViewController;
	
	function ChooseSandwichViewController(){
		this._view;
		this._container;
		this._model;
				
		this.didSelectSandwich;
		
		this.update = function(sandwiches) {
			var context = this;
			
			var list = $(this._view.find("ul"));
			list.empty();
						
			sandwiches.forEach(function(sandwich) {
				var template = '<li class="sando-button" data-id="'+sandwich.id+'"><img src="'+sandwich.hero+'" alt="'+sandwich.name+'"/></li><!-- -->';				
				list.append(template);
			});
			
			$(list.find("li")).on("click", function() {
				context.didSelectSandwich($(this).data("id"));
			})
		}
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><ul></ul></div></div>';
			
			this._container.append(template);
			
			this._view = $("#" + pageId);
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
	}
	
	
	window.ChooseSandwichViewController = ChooseSandwichViewController;
}(window));