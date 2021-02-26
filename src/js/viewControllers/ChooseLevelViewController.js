/*GENERIC  VIEW CONTROLLER*/
(function(window){
	ChooseLevelViewController.prototype = new BaseViewController();
	ChooseLevelViewController.prototype.constructor = ChooseLevelViewController;
	
	function ChooseLevelViewController(){
		this._view;
		this._container;
		this._model;
		this.didSelectLevel;
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><ul></ul></div></div>';
			 
			this._container.append(template);
			
			this._view = $("#" + pageId);
		}
		
		this.reset = function() {
			var context = this;
			var content = $(this._view.find("ul"));
			
			content.empty();
		}
		
		this.setupLevels = function(levels) {
			var context = this;
			var content = $(this._view.find("ul"));
			
			levels.forEach(function(level) {
				var completedClass = (level.completed) ? "completed" : "";
				var desc = (level.completed) ? level.completion_message : level.desc;
				var template = '<li class="level ' + completedClass + '"><div class="level-content"><h3>' + desc + '</h3><div class="level-button button" data-id="' + level.id + '">' + level.title + '<img src="img/content/level-select-arrow.png" alt=""/></div></div></li>';
				content.append(template);
			});
			
			var buttonWidth = 0;
			
			$(this._view.find(".level-button")).each(function() {
				buttonWidth = ($(this).width() > buttonWidth) ? $(this).width() : buttonWidth;
			});
			
			$(this._view.find(".level-button")).each(function() {
				$(this).css({"width": buttonWidth});
			});
			
			console.log("buttonWidth", buttonWidth);
			
			$(this._view.find(".level-button")).on("click", function() {
				context.didSelectLevel($(this).data("id"));
			});
			
			$(this._view.find("li").each(function() {
				TweenMax.to(this, 0, {alpha: 0});
			}));
			
			$(this._view.find(".level-button").each(function() {
				TweenMax.to(this, 0, {right: "50px", alpha: 0});
			}));
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			var timeline = new TimelineMax();
			
			timeline.to(this._view, 0, {autoAlpha: 1});
			
			$(this._view.find("li").each(function() {
				timeline.to(this, 0.5, {alpha: 1}, "-=0.40");
			}));
			
			$(this._view.find(".level-button").each(function() {
				timeline.to(this, 0.5, {right: "25px", alpha: 1}, "-=0.40");
			}));

			timeline.play();
		}
		
		this.exit = function(completion) {
			var timeline = new TimelineMax();
			
			$(this._view.find("li").toArray().reverse()).each(function() {
				timeline.to(this, 0.5, {alpha: 0}, "-=0.35");
			});
			
			$(this._view.find(".level-button").toArray().reverse()).each(function() {
				timeline.to(this, 0, {right: "50px", alpha: 0});
			});
			
			
			timeline.to(this._view, 0, {autoAlpha: 1, onComplete: function() {
				if (completion) { completion(); }
			}});
			
			timeline.play();
		}
	}
	
	
	window.ChooseLevelViewController = ChooseLevelViewController;
}(window));