/*GENERIC  VIEW CONTROLLER*/
(function(window){
	CompletionViewController.prototype = new BaseViewController();
	CompletionViewController.prototype.constructor = CompletionViewController;
	
	function CompletionViewController(){
		this._view;
		this._container;
		this._isWinner;
		this._message;
		this._particles;
		this.didSelectNextStep;
		this.didSelectStartOver;
		this.didSelectTryAgain;
		
		
		this.setup = function() {
			var context = this;
			
			this._container.empty();
			
			var template = (this._isWinner) ? "templates/winner-modal.html" : "templates/loser-modal.html";
			
			this._container.load(template, function() {
				context.onLoad();
			});
		}
		
		this.onLoad = function() {
			var context = this;
			if (this._isWinner) {
				this._view = $(this._container.find(".winner"));
				this._view.find("#winner-next-button").on("click", function() {
					context.didSelectNextStep();
					context.exit();
				});
				
				$("#particles")
				.particles()
				.ajax("data/particles.json", function (container) {
					context._particles = container;
		  		});
			} else {
				this._view = $(this._container.find(".loser"));
				
				
				this._view.find("#loser-tryagain-button").on("click", function() {
					context.didSelectTryAgain();
					context.exit();
				});
				
				this._view.find("#loser-startover-button").on("click", function() {
					context.didSelectStartOver();
					context.exit();
				});
			}
							
			$(this._view.find("#inner-title")).html(this._message);
			
			var content = $(this._view).find(".modal-content");
			
			TweenMax.to(content, 0, {scale: 0});
			
			$("#particles").css({"opacity": 0});
			
			var timeline = new TimelineMax();
			
			timeline.to(content, 0.25, {scale: 1, ease:Back.easeOut});
			timeline.to($("#particles"), 0.5, {alpha: 1, ease:Sine.easeOut, onComplete: function() {
				
			}});
			
			timeline.play();
		}
		
		this.deinit = function() {
			if (this._particles) {
				this._particles.stop();
				this._particles.destroy();
				this._container.empty();
			}
		}
			
		this.init = function(container, isWinner, message) {
			this._container = container;
			this._isWinner = isWinner;
			this._message = message;
			this.setup();
		}
		
		this.intro = function(completion) {						
			var timeline = new TimelineMax();
			
			timeline.to(this._container, 0.25, {autoAlpha: 1});
			
			timeline.play();
			
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._container, 0.25, {autoAlpha: 0, onComplete: function() {
				context.deinit();
			}});
		}
	}
	
	
	window.CompletionViewController = CompletionViewController;
}(window));