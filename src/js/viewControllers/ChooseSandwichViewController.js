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
			
			$(list.find("li").each(function(){
				TweenMax.to(this, 0, {scale: 0, alpha: 0});
			}));

			
			$(list.find("li")).on("click", function() {
				context.didSelectSandwich($(this).data("id"));
			});
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
		
		this.intro = function(completion) {
			var context = this;
			var timeline = new TimelineMax();
			var list = $(this._view.find("ul"));
			
			timeline.to(this._view, 0, {autoAlpha: 1});
			
			$(list.find("li").each(function(){
				timeline.to(this, 0.25, {scale: 1, alpha: 1, ease:Back.easeOut}, "-=0.20");
			}));
			
			timeline.play();
		}
		
		this.exit = function(completion) {
			
			var timeline = new TimelineMax();
			var list = $(this._view.find("ul"));
			
			timeline.to(this._view, 0, {autoAlpha: 1});
			
			$(list.find("li").toArray().reverse()).each(function(){
				timeline.to(this, 0.25, {scale: 0, alpha: 0, ease:Back.easeOut}, "-=0.20");
			});
			
			timeline.to(this._view, 0, {autoAlpha: 0, onComplete: function() {
				if (completion) { completion(); }
			}});
			
			timeline.play();
		}

	}
	
	
	window.ChooseSandwichViewController = ChooseSandwichViewController;
}(window));