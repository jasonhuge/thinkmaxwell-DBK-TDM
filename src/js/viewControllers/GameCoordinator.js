/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function GameCoordinator(){
		this._view;
		this._slider;
		
		this._deviceType;
		this._model;
		
		this._viewControllers;
		this._currentStep;
		
		this._presentNavigationClosure;
		this._hideNavigationClosure;
	
		this.setup = function() {
			var context = this;
			
			this._slider = $(this._view.find(".page-slider"));
			this._currentStep = 0;
			
			var intro = new IntroViewController();
			intro.init($(this._view.find("#intro")), function() {
				context.onNextButtonTap();
			});
			
			var howTo = new HowToViewController();
			howTo.init($(this._view.find("#how-to")), this._deviceType);
			
			var chooseLevel = new ChooseLevelViewController();
			chooseLevel.init($(this._view.find("#choose-level")), this._deviceType);
			
			var chooseSandwich = new ChooseSandwichViewController();
			chooseSandwich.init($(this._view.find("#choose-sandwich")), this._deviceType);
			
			var game = new GameViewController();
			game.init($(this._view.find("#game-play")), this._deviceType);
			
			this._viewControllers = [
				intro,
				howTo,
				chooseLevel,
				chooseSandwich,
				game
			];
			
		}
		
		this.onNextButtonTap = function() {
			if (this._currentStep == this._viewControllers.count - 1) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep ++;
			
			var vc = this._viewControllers[this._currentStep];
			
			var left = -(this._view.width() * this._currentStep);
			
			console.log(this._view)
			
			vc.intro();
			
			if (this._currentStep > 0) {
				this._presentNavigationClosure();
			}
			
			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.onBackButtonTap = function() {
			if (this._currentStep == 0) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep --;
			
			var vc = this._viewControllers[this._currentStep];
			
			vc.exit();
			
			var left = -(this._view.width() * this._currentStep);
			
			if (this._currentStep == 0) {
				this._hideNavigationClosure();s
			}
			
			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.onStartOverButtonTap = function() {
			
		}
		
		this.reset = function() {
			
		}

		this.loadJSON = function(completion) {
			var context = this;
			
			$.ajax({
				url: "data/app.json",
				type: "GET",
				dataType: "json",
				success: function(response) {
					context._model = response;
					context.loadStats(completion);
				}
			});
		}
		
		this.loadStats = function(completion) {
			var context = this;
			var game = this._model.game;
			var loadCount = game.levels.length;
			
			game.levels.forEach(function(level){
				if (level.max_num_participants != null) {
					$.ajax({
						url: "api/stats/index.php",
						data: {
							'id': level.list_id
						},
						type: "GET",
						dataType: "json",
						success: function(response) {
							level.stats = response.stats;
							loadCount -= 1;
							if (loadCount === 0) {
								context.loadCookies(completion);
							}
						},
						error: function (request, error) {
							//console.log("failed", request, error);
    					}
					});
				} else {
					loadCount -= 1;
				}
			});
		}
		
		this.loadCookies = function(completion) {
			var game = this._model.game;
			
			game.levels.forEach(function(level) {
				var name = level.id + "_completed";
				level.completed = $.cookie(name) ?? false;
			});
			
			completion();
		}
	}
	
	GameCoordinator.prototype = {
		init:function(target, deviceType){
			this._view = $(target);
			this._deviceType = deviceType;
			this.setup();
		},
		load: function(completion) {
			this.loadJSON(completion);
		},
		gameImages: function() {
			if (this._model == null) { return; }
			
			var game = this._model.game;
			var images = [];
			
			game.sandwiches.forEach(function(sandwich){
				images.push(sandwich.thumbnail);
				images.push(sandwich.top);
				images.push(sandwich.middle);
				images.push(sandwich.bottom);
			});
			
			return images;
		},
		onWindowResize:function(e){
			
		},
		dealloc:function(){
			this._view = null;
			this._deviceType = null;
			this._model = null;
		}
	}
	
	window.GameCoordinator = GameCoordinator;
}(window));