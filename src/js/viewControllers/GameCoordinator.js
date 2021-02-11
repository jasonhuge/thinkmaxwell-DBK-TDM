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
			// need to populate random tops middles and bottoms
			
			var sandwichId = this._game.sandwich.id;
									
			gameVc.update(this._game);
			
			this.presentCountdown();
		}
		
		this.endGamePlay = function(success) {
			if (success) {
				this.presentSuccessMessage();
			} else {
				this.presentFailureMessage();
			}
		}
			
		this.presentSuccessMessage = function() {
			var modal = $(".modal");
			var context = this;

			var vc = new WinnerModalViewController();
			vc.init(modal);
			
			vc.selectNextListener = function() {
				if (context._game.level.id === 1) {
					context.presentCoupon();
				} else {
					context.presentContactForm();
				}
				
				vc.exit();
			}
			
			vc.intro();
		}
		
		this.presentFailureMessage = function() {
			this.presentSuccessMessage();
		}

		this.presentCoupon = function() {
			var viewModel = this._viewModel.couponData();
			
			var vc = new CouponViewController();
			vc.init(viewModel, this._presenter);
			
			this._viewControllers.push(vc);
			
			//this.presentNextViewController();
		}
		
		this.presentContactForm = function() {
			var context = this;
			
			var viewModel = this._viewModel.contactData();
			
			var vc = new ContactViewController();
			vc.init(viewModel, this._presenter);
			
			vc.didSubmitForm = function() {
				context.presentNextViewController();
			}
			
			this._viewControllers.push(vc);
			
			//this.presentNextViewController();
		}

		this.presentCountdown = function() {
			var context = this;
			var vc = new CountdownViewController();
			vc.init($("#game-countdown"));
			
			vc.onIntroComplete = function() {
				context.presentNextViewController();
			}

			vc.intro();
		}

		this.presentNextViewController = function() {
			//if (this._currentStep == (this._viewControllers.length - 1)) { return; }
			
			var prevVc = this._viewControllers[this._currentStep];  
			
			if (prevVc && prevVc instanceof ContactViewController && prevVc._hasSubmittedData === false) {
				
				prevVc.submit();
				return;
			}
						
			this._currentStep ++;
			
			console.log("current step", this._currentStep)
			
			var vc = this._viewControllers[this._currentStep];
			
			if (vc instanceof ChooseSandwichViewController) {
				vc.update(this._game.sandwiches);
			}
			
			this.navigateToStep(vc, prevVc);

		}
		
		this.presentPrevViewController = function() {
			if (this._currentStep == 0) { 
				this.exit();
				return; 
			}
			
			var prevVc = this._viewControllers[this._currentStep];
									
			this._currentStep --;
			
			var vc = this._viewControllers[this._currentStep];
			
			this.navigateToStep(vc, prevVc);
		}
		
		this.navigateToStep = function(currentVc, prevVc) {
			console.log("current", currentVc);
			var step = currentVc._model;
			var headerImage = (currentVc instanceof GameViewController && this._game.sandwich !== null) ? this._game.sandwich.thumbnail : null;

			var headerModel = {
				title: step.title,
				image: headerImage
			}
			
			var footerModel = {
				backTitle: step["back-title"],
				nextTitle: step["next-title"]
			}
			
			this.shouldNavigateToStep(headerModel, footerModel);
			
			if (prevVc) {
				prevVc.exit(function() {
					currentVc.intro();
				});
			} else {
				console.log("intro it", currentVc);
				currentVc.intro();
			}
		}
		
		
		this.reset = function() {
			
		}
		
		this.setup = function() {
			var context = this;			
			var container = this._presenter;
			
			
			this.presentCoupon()
			
			this.presentContactForm();
			

			return;
			
			this._viewModel.steps().forEach(function(step) {
				switch(step.id) {
					case 0:
						var vc = new ChooseLevelViewController();
						vc.init(step, container);
						vc.setupLevels(context._viewModel.levels());
						
						vc.didSelectLevel = function(levelId) {
							context.selectLevel(levelId);
							context.presentNextViewController();
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
				console.log(context._viewControllers, context._currentStep);
				context.navigateToStep(context._viewControllers[context._currentStep], null);
			}});
		}	
		
		this.exit = function() {
			var context = this;
			
			this.exitBegan();
			
			TweenMax.to(this._presenter, 0.5, {autoAlpha: 0, onComplete: function() {
				context.exitComplete();
			}});
		}	
		
				
		this.onWindowResize = function(e) {
			
		}
	}
		
	window.GameCoordinator = GameCoordinator;
}(window));