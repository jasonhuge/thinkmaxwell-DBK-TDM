(function(window){
	RecipeViewController.prototype = new BaseViewController();
	RecipeViewController.prototype.constructor = RecipeViewController;
	
	function RecipeViewController(){
		this._view;
		this._container;
		this._model;
		
		this.setup = function() {
			var pageId = this._model['page-id'];			
			this._container.append(this._model.template);	
			this._view = $("#" + pageId);	
			
			var hero = $(this._view.find("#hero-title"));
			var bread =  $(this._view.find("#hero-bread"));
			var text =  $(this._view.find("p"));

			hero.css({"left": "-80%"});
			
			TweenMax.to(bread, 0, {scale: 0});
			
			text.css({"opacity": 0});
		}
		
		this.update = function(sandwich) {
			var recipe = sandwich.recipe;
			
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			var hero = $(this._view.find("#hero-title"));
			var bread =  $(this._view.find("#hero-bread"));
			var text =  $(this._view.find("p"));
			
			var timeline = new TimelineMax();
				
			timeline.to(this._view, 0, {autoAlpha: 1});
			
			timeline.to(hero, 0.25, {left: 0, ease:Sine.easeOut});
			timeline.to(bread, 0.25, {scale: 1, ease:Back.easeOut}, "-=0.10");
			timeline.to(text, 0.25, {alpha: 1, ease:Sine.easeOut, function() {
				if (completion) { completion(); }
			}});
			
			timeline.play();

		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._view, 0.25, {autoAlpha: 0, onComplete: function() {
				if (completion) { completion(); }
			}});
		}
	}
	window.RecipeViewController = RecipeViewController;
}(window));