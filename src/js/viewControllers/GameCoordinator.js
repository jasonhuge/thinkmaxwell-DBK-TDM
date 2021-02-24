/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function GameCoordinator(){
		this._presenter;
		this._deviceType;
		this._viewModel;
		this._game = new Game();
		this._viewControllers = [];
		this._currentStep = 0;
		
		this.exitBegan;
		this.exitComplete;
		this.shouldNavigateToStep;

		this.gameImages = function() { return this._viewModel.gameImages(); }
		
		this.selectLevel = function(id) {
			this._game.level = this._viewModel.levelForId(id);
			this._game.sandwiches = this._viewModel.sandwichesForLevel(id);
		}
		
		this.selectSandwich = function(id) {
			this._game.sandwich = this._viewModel.sandwichWithId(id);
		}
		
		this.beginGamePlay = function() {
			var context = this;
			
			var gameVc = this._viewControllers.find(vc => { return vc instanceof GameViewController});
		
			this._game.affirmations = this._viewModel.randomAffirmations(3);
			var sandwichId = this._game.sandwich.id;
									
			gameVc.update(this._game);
			
			this.presentCountdown();
		}
		
		this.saveCookieForLevel = function() {
			var level = this._game.level;
			level.completed = true;
			
			var name = level.id + "_completed"
			
			$.cookie.set(name, true);
		}
		
		this.endGamePlay = function(success) {
			var modal = $(".modal");
			var context = this;

			var vc = new CompletionViewController();
			vc.init(modal, true);
			
			vc.didSelectNextStep = function() {
				if (context._game.level.id === 1) {
					context.presentCoupon();
				} else {
					context.presentContactForm();
				}
				
				context.goToNextScreen();
				
				vc.exit();
			}
			
			vc.didSelectStartOver = function() {
				context.startOver();
			}
			
			vc.didSelectTryAgain = function() {
				context.beginGamePlay();
				context.presentCountdown();
			}
			
			vc.intro();
		}
		
		this.presentCoupon = function() {
			var viewModel = this._viewModel.couponData();
			
			var vc = new CouponViewController();
			vc.init(viewModel, this._presenter);
			
			this._viewControllers.push(vc);
		}
		
		this.presentContactForm = function() {
			var context = this;
			
			var viewModel = this._viewModel.contactData();
			
			var vc = new ContactViewController();
			vc.init(viewModel, this._presenter);
			
			vc.didSubmitForm = function() {
				context.presentRecipe();
				context.goToNextScreen();
			}
			
			this._viewControllers.push(vc);
		}

		this.presentCountdown = function() {
			var context = this;
			var vc = new CountdownViewController();
			vc.init($("#game-countdown"));
			
			vc.onIntroComplete = function() {
				context.goToNextScreen();
			}

			vc.intro();
		}
		
		this.presentRecipe = function() {
			var context = this;
			var viewModel = this._viewModel.recipeData();
			
			var vc = new RecipeViewController();
			vc.init(viewModel, this._presenter);
			vc.update(this._game.sandwich);

			
			this._viewControllers.push(vc);

		}
		
		this.startOver = function() {
			var vc = this._viewControllers[this._currentStep];
			
			var context = this;
				
			vc.exit(function() {
				context.reset();
				context.intro();
			});
		}

		this.presentNextViewController = function() {
			var vc = this._viewControllers[this._currentStep];
			var model = vc._model;
			var action = model.next.action;

			if (action === "nav") {
				this.goToNextScreen();
			} else if (action === "link") {
				var link = this._game.sandwich.recipe.link;
				window.open(link, '_blank');
			} else if (action === "play_again") {
				//play again
				this.startOver();
			} else if (action === "submit_form") {
				vc.submit(this._game.level);
			}
		}
	
		this.presentPrevViewController = function() {
			var vc = this._viewControllers[this._currentStep];
			var model = vc._model;
			var action = model.back.action;
			
			if (action === "nav") {
				this.goToPrevScreen();
			} else if (action === "link") {
				var link = this._game.sandwich.recipe.link;
				window.open(link, '_blank');
			}
		}

		this.goToPrevScreen = function() {
			if (this._currentStep == 0) { 
				this.exit();
				return; 
			}
			
			var prevVc = this._viewControllers[this._currentStep];
									
			this._currentStep --;
			
			var vc = this._viewControllers[this._currentStep];
			
			this.navigateToStep(vc, prevVc);
		}
		
		this.goToNextScreen = function() {
			var prevVc = this._viewControllers[this._currentStep];  
			
			if (prevVc instanceof CouponViewController || prevVc instanceof ContactViewController) {
				this.presentRecipe();
			}
			
			if (this._currentStep == (this._viewControllers.length - 1)) { return; }
									
			this._currentStep ++;
						
			var vc = this._viewControllers[this._currentStep];
			
			if (vc instanceof ChooseSandwichViewController) {
				vc.update(this._game.sandwiches);
			}
			
			this.navigateToStep(vc, prevVc);
		}
		
		this.navigateToStep = function(currentVc, prevVc) {
			var step = currentVc._model;

			var headerImage = (currentVc instanceof GameViewController && this._game.sandwich !== null) ? this._game.sandwich.thumbnail : null;

			var headerModel = {
				title: step.title,
				image: headerImage
			}
			
			var footerModel = {
				back: step.back,
				next: step.next
			}
			
			this.shouldNavigateToStep(headerModel, footerModel);
			
			if (prevVc) {
				prevVc.exit(function() {
					currentVc.intro();
				});
			} else {
				currentVc.intro();
			}
		}
		
		
		this.reset = function() {
			var context = this;
			
			this._game = new Game();
			
			var viewControllers = this._viewControllers;
			
			viewControllers.forEach(function(vc) {
				vc.reset();
				
				if (vc instanceof CouponViewController || vc instanceof ContactViewController || vc instanceof RecipeViewController) {
					vc.dealloc();
				}
			});
			
			this._viewControllers = this._viewControllers.filter(vc => !(vc instanceof CouponViewController || vc instanceof ContactViewController || vc instanceof RecipeViewController));
			
			
			this._currentStep = 0;
		}
		
		this.setup = function() {
			var context = this;			
			var container = this._presenter;
			
			this._viewModel.steps().forEach(function(step) {
				switch(step.id) {
					case 0:
						var vc = new ChooseLevelViewController();
						vc.init(step, container);
						vc.setupLevels(context._viewModel.levels());
						
						vc.didSelectLevel = function(levelId) {
							context.selectLevel(levelId);
							context.goToNextScreen();
						}
						
						context._viewControllers.push(vc);
						break;
					case 1:
						var vc = new ChooseSandwichViewController();
						vc.init(step, container);
						
						vc.didSelectSandwich = function(sandwichId) {
							context.selectSandwich(sandwichId);
							context.beginGamePlay();
						}
						context._viewControllers.push(vc);
						break;
					case 2:
						var vc = new GameViewController();
						vc.init(step, container);
						
						vc.didFinishGame = function(success) {
							context.endGamePlay(success);
						}
						
						context._viewControllers.push(vc);
					break
				}
			});			
		}
		
		this.loadCookies = function() {				
			this._viewModel.levels().forEach(function(level) {
				var name = level.id + "_completed";
				level.completed = $.cookie(name) ?? false;
			});
			
			this.setup();
		}
		
		this.init = function(viewModel, presenter) {
			this._viewModel = viewModel;
			this._presenter = presenter;
			
			this.loadCookies();
		}
		
		this.intro = function() {
			var context = this;
			
			TweenMax.to(this._presenter, 0, {autoAlpha: 1, onComplete: function() {
				context.navigateToStep(context._viewControllers[context._currentStep], null);
			}});
		}	
		
		this.exit = function() {
			var context = this;
			
			this.exitBegan();
			
			var vc = this._viewControllers[this._currentStep];
			
			vc.exit(function(){
				TweenMax.to(context._presenter, 0, {autoAlpha: 0, onComplete: function() {
					context.exitComplete();
				}});
			});
		}	
		
		this.onOrientationChange = function(e){	
			this._viewControllers.forEach(function(vc) {
				vc.onOrientationChange(e);
			})
		}
				
		this.onWindowResize = function(e) {
			
		}
	}
		
	window.GameCoordinator = GameCoordinator;
}(window));