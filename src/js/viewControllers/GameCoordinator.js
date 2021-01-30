/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function GameCoordinator(){
		this._view;
		this._slider;
		
		this._deviceType;
		this._model;
		
		this._viewControllers = [];
		this._currentStep;

		this._header;
		this._footer;
		
		this._game = {
			"level": null,
			"sandwiches": null,
			"sandwich": null,
			"randomMiddle": null,
			"randomTop": null,
			"randomBottom": null
		}
		
		this.levelForId = function(id) {
			var levels = this._model.levels;
			return levels.find(level => {
				return level.id === id;
			});
		}
		
		this.sandwichesForLevel = function() {
			if (this._game.level === null) return null;
			var context = this;
			var sandwichIds = this._game.level.sandwich_ids;
			
			var sandwiches = [];
			
			sandwichIds.forEach(function(sandwichId) {
				var sandwich = context._model.sandwiches.find(sando => { return sando.id === sandwichId});
				sandwiches.push(sandwich);
			});

			return sandwiches;
		}
		
		this.sandwichWithId = function(sandwichId) {
			return this._game.sandwiches.find(sando => { return sando.id === sandwichId});
		}
		
		this.selectLevel = function(levelId) {
			this._game.level = this.levelForId(levelId);
			this._game.sandwiches = this.sandwichesForLevel();
		}
		
		this.selectSandwich = function(sandwichId) {
			this._game.sandwich = this.sandwichWithId(sandwichId);
		}
		
		this.beginGamePlay = function() {
			var context = this;
			
			var gameVc = this._viewControllers.find(vc => { return vc instanceof GameViewController});
			// need to populate random tops middles and bottoms
			
			var sandwichId = this._game.sandwich.id;
									
			gameVc.update(this._game);
			
			this.onNextButtonTap();
		}
	
		this.setup = function() {
			var context = this;
			
			this._footer.nextClosure = function() {
				context.onNextButtonTap();
			}
			
			this._footer.backClosure = function() {
				context.onBackButtonTap();
			}
			
			this._slider = $(this._view.find(".page-slider"));
			this._currentStep = 0;
			
			var steps = this._model.steps;
			var levels = this._model.levels;
			
			steps.forEach(function(step){
				switch(step["page-id"]) {
					case "intro":
						var vc = new IntroViewController();
						vc.init(step, context._slider);
						vc.playButtonListener = function() {
							context.onNextButtonTap();
						}
						
						context._viewControllers.push(vc);
						break;
					case "choose-level":
						var vc = new ChooseLevelViewController();
						vc.init(step, context._slider);
						vc.setupLevels(levels);
						vc.selectLevelListener = function(levelId) {
							context.selectLevel(levelId);
							context.onNextButtonTap();
						}
						
						context._viewControllers.push(vc);
						break;
					case "choose-sando":
						var vc = new ChooseSandwichViewController();
						vc.init(step, context._slider);
						vc.didSelectSandwich = function(sandwichId) {
							context.selectSandwich(sandwichId);
							context.beginGamePlay();
						}
						context._viewControllers.push(vc);
						break;
					case "gameplay":
						var vc = new GameViewController();
						vc.init(step, context._slider);
						context._viewControllers.push(vc);
						break;
				}
			});
		}
		
		this.onNextButtonTap = function() {
			if (this._currentStep == this._viewControllers.count - 1) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep ++;
			
			var vc = this._viewControllers[this._currentStep];
			
			if (vc instanceof ChooseSandwichViewController) {
				vc.update(this._game.sandwiches);
			}
			
			var left = -(this._view.width() * this._currentStep);
			
			preVC.exit();
			vc.intro();
			
			if (this._currentStep > 0) {
				this._header.intro(true);
				this._footer.intro(true);
			}
			
			var sandwichThumb = null;
			
			if (vc instanceof GameViewController) {
				sandwichThumb = this._game.sandwich.thumbnail;
			}
			
			this._header.update(this._model.steps[this._currentStep], sandwichThumb);

			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.onBackButtonTap = function() {
			if (this._currentStep == 0) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep --;
			
			var vc = this._viewControllers[this._currentStep];
			
			preVC.exit();
			vc.intro();
			
			var left = -(this._view.width() * this._currentStep);
			
			if (this._currentStep == 0) {
				this._header.exit(true);
				this._footer.exit(true);
			}
			
			this._header.update(this._model.steps[this._currentStep], null);

			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.onStartOverButtonTap = function() {
			
		}
		
		this.reset = function() {
			
		}

		this.loadJSON = function(completion) {
			var context = this;
			console.log("load json")
			$.ajax({
				url: "data/app.json",
				type: "GET",
				dataType: "json",
				success: function(response) {
					console.log(response);
					context._model = response.game;
					context.setup();
					context.loadStats(completion);
				}
			});
		}
		
		this.loadStats = function(completion) {
			var context = this;
			var game = this._model;
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
			this._model.levels.forEach(function(level) {
				var name = level.id + "_completed";
				level.completed = $.cookie(name) ?? false;
			});
			
			completion();
		}
	}
	
	GameCoordinator.prototype = {
		init:function(target, deviceType, header, footer){
			this._view = $(target);
			this._deviceType = deviceType;
			this._header = header;
			this._footer = footer;
		},
		load: function(completion) {
			this.loadJSON(completion);
		},
		gameImages: function() {
			if (this._model == null) { return; }
			
			var images = [];
			
			this._model.sandwiches.forEach(function(sandwich){
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