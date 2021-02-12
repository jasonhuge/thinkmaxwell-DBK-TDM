
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function App(){
		
		this._deviceType;
		this._preloader;
		this._model;
		
		this._header;
		this._footer;
		
		this._introCoordinator;
		this._gameCoordinator;
		this._completionCoordinator;
		
		this.loadScripts = function(e){
			var context = this;
			
			$.getScript("https://code.createjs.com/preloadjs-0.6.2.min.js", function(){
				$.getScript("https://code.createjs.com/createjs-2015.11.26.min.js", function(){
					context.loadModel();
				});
			});
			
		};
		
		this.loadModel = function() {
			var context = this;
			$.ajax({
				url: "data/app.json",
				type: "GET",
				dataType: "json",
				success: function(response) {
					context._model = response;
					context.setup();
				},
				error: function(error) {
					console.log(error);
				}
			});
		}
				
		this.setup = function() {
			var context = this;
			
			this._header = new HeaderViewController();
			this._header.init($("#app-header"))
			
			this._footer = new FooterViewController();
			this._footer.init($("#app-footer"));
			
			this._footer.didSelectNextButton = function() {
				context._gameCoordinator.presentNextViewController();
			}
			
			this._footer.didSelectBackButton = function() {
				context._gameCoordinator.presentPrevViewController();
			}

			
			this._introCoordinator = new IntroCoordinator();
			this._introCoordinator.init(this._model.intro, $("#intro-container"));
			
			var gameViewModel = new GameViewModel();
			gameViewModel.init(this._model.game);
			
			this._gameCoordinator = new GameCoordinator();
			this._gameCoordinator.init(gameViewModel, $("#game-container"));
			
			this._gameCoordinator.exitBegan = function() {
				context.hideNavigation();
			}
			
			this._gameCoordinator.exitComplete = function() {
				context._introCoordinator.intro();
			}
			
			this._gameCoordinator.shouldNavigateToStep = function(headerData, footerData) {
				console.log("should navigate", headerData, footerData)
				context._header.update(headerData);
				context._footer.update(footerData);
			}
			
			this._introCoordinator.exitComplete = function() {
				context._gameCoordinator.intro();
				context.showNavigation();
			}

			this.loadContent();
		}
		
		this.showNavigation = function() {
			this._header.intro(true);
			this._footer.intro(true);
		}
		
		this.hideNavigation = function() {
			this._header.exit(true);
			this._footer.exit(true);
		}
	
		this.loadContent = function(){
    		var context = this;
    		var gameImages = this._gameCoordinator.gameImages();
    		
			this._preloader = new PreloadViewController();
			this._preloader.init($(".preloader"));
			
            $(this._preloader).on("onExitComplete", function(e){ context.onPreloaderExitComplete(e); });
             
			this._preloader.intro(function() {
				context._preloader.loadContent(gameImages, function(e){
					context.onLoadContentComplete(e);
					
					context._preloader.exit(function(e) {
						context.intro();
					});
				});
			});
		};
				
		this.onLoadContentComplete = function(e){    		
    		this.onWindowResize();
			           
        };
		
		this.onPreloaderExitComplete = function(e){
    		this._intro();
		};
		
		this.intro = function(){
			this._introCoordinator.intro();
		};
		
		this.onOrientationChange = function(e){	
    		var context = this;
    		
		};
				
		this.onWindowResize = function(){
			
   		}
	}
	
	App.prototype = {
		init:function(deviceType){
			this._deviceType = deviceType;
			
			var context = this;
	
			$(window).on("orientationchange", function(e){ context.onOrientationChange(e); });
			$(window).on("resize", function(e){ context.onWindowResize(e); });
																							
			this.loadScripts();
		}
	};
	
	window.App = App;
}(window));


// Avoid `console` errors in browsers that lack a console.


(function() {
	"use strict";
	
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function(window){	
	function GameViewModel() {
		this._data;
		
		this.couponData = function() {
			return this._data.coupon;
		}
		
		this.contactData = function() {
			return this._data.contact;
		}

		this.recipeData = function() {
			return this._data.recipe;
		}
		
		this.sandwiches = function() {
			return this._data.sandwiches;
		}
		
		this.levels = function() {
			return this._data.levels;
		}
		
		this.stepForIndex = function(index) {
			return this.steps()[index];
		}
		
		this.steps = function() {
			return this._data.steps;
		}
		
		this.numLevels = function() {
			return this.levels.length;
		}
		
		this.hasBeatenLevelWithId = function(id) {
			return leveForId(id).completed;
		}
		
		this.levelForId = function(id) {
			return this.levels().find(level => { return level.id === id; });
		}
		
		this.sandwichesForLevel = function(id) {
			var level = this.levelForId(id);	
			console.log(level, id);		
			var context = this;
			var sandwichIds = level.sandwich_ids;
			
			var sandwiches = [];
			
			sandwichIds.forEach(function(id) {
				var sandwich = context.sandwiches().find(sando => { return sando.id === id});
				sandwiches.push(sandwich);
			});

			return sandwiches;
		}
		
		this.sandwichWithId = function(id) {
			return this.sandwiches().find(sando => { return sando.id === id});
		}
		
		this.gameImages = function() {			
			var images = [];
			
			this.sandwiches().forEach(function(sandwich){
				images.push(sandwich.thumbnail);
				images.push(sandwich.top);
				images.push(sandwich.middle);
				images.push(sandwich.bottom);
			});
			
			return images;
		}
		
		this.init = function(data) {
			this._data = data;
		}
	}
	window.GameViewModel = GameViewModel;
}(window));

(function(window){	
	function Game() {
		this.level;
		this.sandwiches;
		this.sandwich;
		this.randomMiddle;
	}
	window.Game = Game;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	
	function BaseViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		
		this.onCloseButtonClick = function(e){
			this.exit();
		}

		this.onIntroComplete = function(){
			$(this).trigger("onIntroComplete");
		}
	
		this.onExitComplete = function(){
			$(this).trigger("onExitComplete");
		}
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
		
	}
	BaseViewController.prototype = {
		init:function(target, model, deviceType){
			this.baseSetup(target, model, deviceType);
		},
		setTitle:function(title){
			
		},
		onWindowResize:function(e){
			
		},
		reset: function() {
			
		},
		dealloc:function(){
			this._view.remove();			
			this._pageContent = null;
			this._view = null;
			this._deviceType = null;
			this._model = null;
		},
		intro: function(completion) {
			this._view.css({"opacity" : 1});
			
			if (completion) {
				completion();
			}
			
		},
		exit: function(completion) {
			this._view.css({"opacity" : 0});
			if (completion) {
				completion();
			}
		},
		removeFromParent:function(){
			this._view.remove();
			this._view = null;
		},
		snapIn:function(){
			this._view.show();
		},
		snapOut:function(){
			this._view.hide();
		},
		pause:function(){
			
		},
		updateOnNavigationEvent:function(vars){
			
		}
		
	}
	
	window.BaseViewController = BaseViewController;
}(window));
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
		
		this.setupLevels = function(levels) {
			var context = this;
			var content = $(this._view.find("ul"));
			
			levels.forEach(function(level) {
				var template = '<li class="level"><div class="level-content"><h3>' + level.desc + '</h3><div class="level-button button" data-id="' + level.id + '">' + level.title + '<img src="img/content/level-select-arrow.png" alt=""/></div></div></li>';
				content.append(template);
			});
			
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
				timeline.to(this, 0.5, {right: "25px", alpha: 1}, "-=0.60");
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
(function(window){
	ContactViewController.prototype = new BaseViewController();
	ContactViewController.prototype.constructor = ContactViewController;
	
	function ContactViewController(){
		this._view;
		this._container;
		this._model;
		this.selectLevelListener;
		this._hasSubmittedData = false;
		
		this.reset = function() {
			this._hasSubmittedData = false;
			
			$(form.find("input,select")).each(function() {
				$(this).val(""); 
			})
		}
		
		this.validateEmail = function(email) {
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
			return regex.test(email);
		}
		
		this.validatePhoneNumber = function(phoneNumber) {
			var regex = /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/;
			return regex.test(phoneNumber);
		}
		
		this.vaildate = function(completion) {
			var context = this;
			var isReady = true;
			var form = $(this._view.find("form"));
			
			$(form.find("input,select")).each(function() {
				if (!$(this).val()) {
					if (isReady) {
						$(this).focus();
					}
					isReady = false
					$(this).addClass("error");
					
				} 
				
				if ($(this).attr("name") === "email") {
					if (!context.validateEmail($(this).val())) {
						isReady = false;
						$(this).addClass("error");
					}
				}
				
				if ($(this).attr("name") === "phone") {
					if (!context.validatePhoneNumber($(this).val())) {
						isReady = false;
						$(this).addClass("error");
					}
				}
			});
		
			completion(isReady);
		}
		
		this.setup = function() {
			var pageId = this._model['page-id'];			
			this._container.append(this._model.template);	
			this._view = $("#" + pageId);	
			
			var form = $(this._view.find("form"));

			$(form.find("input,select")).each(function() {
				$(this).keypress(function() {
					$(this).removeClass("error");
				});
				
				$(this).change(function() {
					$(this).removeClass("error");
				})
			});
					
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.submit = function(level) {
			var context = this;
			this.vaildate(function(success){
				if (success) {
					var data = $(context._view.find("form")).serializeArray();
					var url = "api/register/index.php";
					
					data.push({name: "id", value: "19f888674a"});
	
					$.ajax({
						type: "POST",
						url: url,
						data: data,
						success: function(data){
							console.log(data);
						},
						error: function(error) {
							console.log(error.responseText);
						}
					});
				}
			});
		}
		
		this.intro = function(completion) {
			console.log("contact intro", this._view);
			TweenMax.to(this._view, 0.25, {autoAlpha: 1});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._view, 0.25, {autoAlpha: 0, onComplete: function() {
				if (completion) { completion(); }
			}});
		}
	}
	
	
	window.ContactViewController = ContactViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	CountdownViewController.prototype = new BaseViewController();
	CountdownViewController.prototype.constructor = CountdownViewController;
	
	function CountdownViewController(){
		this._view;
		this.onIntroComplete;
		this.onExitComplete;
		this._numbers = [];
		this._index = 0;
		
		this.intro = function() {
			var context = this;
			this._view.css({
				"opacity": 0,
				"display": "block"
			})
			TweenMax.to(this._view, 0.25, {alpha: 1, onComplete:function(){ 
				context.onIntroComplete();
				context.countdown();
			}});
		}	
		
		this.exit = function() {
			var context = this;
			TweenMax.to(this._view, 0.25, {alpha: 0, onComplete:function(){ 
				context._view.css({"display": "none"});
			}});
		}
		
		this.countdown = function() {
			var context = this;
			var tl = new TimelineMax({onComplete: function() {
				context.exit();
			}});

			tl.to($("#count-three"), 0.25, {alpha: 1});
			tl.to($("#count-three"), 0.25, {alpha: 0},"+=1");
			tl.to($("#count-two"), 0.25, {alpha: 1});
			tl.to($("#count-two"), 0.25, {alpha: 0},"+=1");
			tl.to($("#count-one"), 0.25, {alpha: 1});
			tl.to($("#count-one"), 0.25, {alpha: 0},"+=1");
		}	
		
		this.setup = function() {
			var context = this;
			this._view.find("li").each(function() {
				var number = $(this);
				context._numbers.push(number);
			});
			
			this._numbers.reverse();
		}
		
		this.init = function(view) {
			this._view = view;
			this.setup();
		}
	}
	
	
	window.CountdownViewController = CountdownViewController;
}(window));
(function(window){
	CouponViewController.prototype = new BaseViewController();
	CouponViewController.prototype.constructor = CouponViewController;
	
	function CouponViewController(){
		this._view;
		this._container;
		this._model;
		
		this.setup = function() {
			var pageId = this._model['page-id'];			
			this._container.append(this._model.template);	
			this._view = $("#" + pageId);	
			
			var header = $("header");
			var footer = $("footer");
			
			var headerHeight = header.outerHeight() + Math.abs(header.position().top);
			var footerHeight = footer.outerHeight();
			var contentHeight = $(window).innerHeight() - (headerHeight + footerHeight);
			
			this._view.css({"top": headerHeight, "height": contentHeight});
			
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			console.log("this. intro", this._view);
			TweenMax.to(this._view, 0.25, {autoAlpha: 1});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._view, 0.25, {autoAlpha: 0, onComplete: function() {
				if (completion) { completion(); }
			}});
		}
	}
	
	
	window.CouponViewController = CouponViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	FooterViewController.prototype = new BaseViewController();
	FooterViewController.prototype.constructor = FooterViewController;
	
	function FooterViewController(){
		this._view;
		this._backButton;
		this._nextButton;
		
		this.didSelectNextButton;
		this.didSelectBackButton;
		
		this.update = function(data) {
			var back = data.back;
			var next = data.next;
			
			if (back) {
				$(this._backButton.find("h4")).text(back.title);
				TweenMax.to(this._backButton, 0.25, {autoAlpha: 1});
			} else {
				TweenMax.to(this._backButton, 0.25, {autoAlpha: 0});
			}
			 
			if (next) {
			 	$(this._nextButton.find("h4")).text(next.title);
			 	TweenMax.to(this._nextButton, 0.25, {autoAlpha: 1});
			} else {
			 	TweenMax.to(this._nextButton, 0.25, {autoAlpha: 0});
			}
		}
		
		this.setup = function() {  
			
			var context = this;
			
			this._backButton = $(this._view.find("#back-button"));
			this._nextButton = $(this._view.find("#spacer-button"));
			
			this._backButton.on("click", function() {
				context.didSelectBackButton();
			});
			
			this._nextButton.on("click", function() {
				console.log("did select next");
				context.didSelectNextButton();
			});
		}
		
		this.intro = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;			
			TweenMax.to(this._view, duration, {css:{opacity:1, bottom: 0, hidden: false}, ease:Sine.easeIn});
		}
		
		this.exit = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;
			var bottom = -(this._view.height() / 4);
			TweenMax.to(this._view, duration, {css:{opacity:0, bottom: bottom, hidden: true}, ease:Sine.easeIn});
		}	
			
		this.baseSetup = function(target, nextListener, backListener) {
			this._view = $(target);
			this._nextListener = nextListener;
			this._backListener = backListener;
			this.setup();
			this.exit(false);
		}
	}

	window.FooterViewController = FooterViewController;
}(window));
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
		
		this.saveCookieForLevel = function() {
			var level = this._game.level;
			level.completed = true;
			
			var name = level.id + "_completed"
			
			$.cookie.set(name, true);
		}
		
		this.endGamePlay = function(success) {
			if (success) {
				this.saveCookieForLevel();
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
				
				context.goToNextScreen();
				
				vc.exit();
			}
			
			vc.intro();
		}
		
		this.presentFailureMessage = function() {
			console.log("this.presentFailureMessage()");
			this.presentSuccessMessage();
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
		
		this.addRecipe = function() {
			var context = this;
			var viewModel = this._viewModel.recipeData();
			
			var vc = new RecipeViewController();
			vc.init(viewModel, this._presenter);
			
			this._viewControllers.push(vc);

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
				var context = this;
				
				vc.exit(function() {
					context.reset();
					context.intro();
				});
				
			} else if (action === "submit_form") {
				vc.submit.submit();
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
				this.addRecipe();
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
				console.log("intro it", currentVc);
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
			
			console.log(this._viewControllers);
			
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
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	GameViewController.prototype = new BaseViewController();
	GameViewController.prototype.constructor = GameViewController;
	
	function GameViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		this._game;
		this._timer;
		this._rows = [];
		this._selectedIds = [];
		
		this.didFinishGame;
		
		this.reset = function() {
			this._game = null;
			
			if (this._timer !== null && this._timer !== undefined) {
				clearInterval(this._timer);
			}
			
			this._timer = null;
			this._selectedIds = [];
			
			this._rows.forEach(function(row){
				row.reset();
			});
		}
		
		this.start = function() {
			var context = this;
			var bottom = $("#bottom ul");
			
			this._timer = setInterval(function() {
				context._rows.forEach(function(row){
					row.animate();
				});
			},1/100);
		}
				
		this.update = function(game) {
			this.reset();
			
			this._game = game;
			var speed = this._game.level.speed;
			var sandwiches = this._game.sandwiches;
			
			this._rows.forEach(function(row){
				switch(row._id) {
					case "top":
					var items = sandwiches.map(function(a){
						return {"image": a.top, "id": a.id, "type": "sando"}
					});
					row.update(items, "left", speed);
					break;
					case "middle":
					var items = sandwiches.map(function(a){
						return {"image": a.middle, "id": a.id, "type": "sando"}
					});
					row.update(items, "right", speed);
					break;
					case "bottom":
					var items = sandwiches.map(function(a){
						return {"image": a.bottom, "id": a.id, "type": "sando"}
					});
					row.update(items, "left", speed);
					break;
				}
			});
			
			this.start();
		}

		this.finishGame = function() {
			clearInterval(this._timer);
			this._timer = null;
			
			var componentsMatch = this._selectedIds.every(id => id === this._selectedIds[0]);
			
			console.log(componentsMatch, this._selectedIds, this._game.sandwich.id === this._selectedIds[0]);
			if (componentsMatch && this._game.sandwich.id === this._selectedIds[0]) {
				this.didFinishGame(true);
			} else {
				this.didFinishGame(false);
			}
		}

		this.setup = function() {
			var context = this;
			
			var pageId = this._model['page-id'];
			
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><p>tap any tile to stop. No Match, no worries! Play again!</p><div id="game-carousel" class="carousel"></div></div></div>';
			
			this._container.append(template);
			
			this._view = $("#" + pageId);
			
			var carousel = $("#game-carousel");
			
			["top", "middle", "bottom"].forEach(function(identifier){
				var view = new GameRow();
				view.init(carousel, identifier);
				
				view.didSelectItemListener = function(itemId) {
					context._selectedIds.push(itemId);
					
					if (context._selectedIds.length === 3) {
						context.finishGame();
					}
				}
				
				context._rows.push(view);
				
				if (identifier != "bottom") {
					carousel.append('<span class="divider"></span>');
				}
			});
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			TweenMax.to(this._view, 0, {autoAlpha: 1, onComplete: function() {
				if (completion) { completion(); }
			}});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._view, 0.5, {autoAlpha: 0, onComplete: function() {
				context.reset();
				if (completion) { completion(); }
			}});
		}
	}
	
	
	window.GameViewController = GameViewController;
}(window));

(function(window){
	function GameRow() {
		this._container;
		this._view;
		this._items;
		this._id;
		this._direction;
		this._speed;
		this._contentWidth;
		this._itemWidth;
		this._hasTappedOnItem;
		this._selectedItem;
		
		this.didSelectItemListener;
		
		this.update = function(items, direction, speed) {
			this.reset();
			
			var context = this;
			
			var slider = $(this._view.find("ul"));
			items.forEach(function(item) {
				switch(item.type) {
					case "sando":
					slider.append('<li style="width: '+context._itemWidth+'px;" class="tile" data-id="'+item.id+'"><img src="'+item.image+'"/></li><!-- -->');
					break;
					case "text":
					break;
					case "sticker":
					break
				}
			});
						
			this._direction = direction;
			this._speed = speed;
			this._contentWidth = this._itemWidth * items.length;
			
			slider.css({"width": this._contentWidth});
			
			if (direction === "right") {
				slider.css({"left": -(this._contentWidth - this._itemWidth)});
			}
		}
		
		this.reset = function() {
			this._direction = null;
			this._speed = null;
			this._contentWidth = null;
			this._hasTappedOnItem = false;
			this._selectedItem = null;
			
			var slider = $(this._view.find("ul"));
			slider.empty();
		}
		
		this.onItemClicked = function(){
			this._hasTappedOnItem = true;
		}
		
		this.animateToSelectedItem = function() {
			if (this._selectedItem !== null) return
			
			var context = this;
			
			var slider = $(this._view.find("ul"));
			var item = null;
			
			slider.find("li").each(function(){
				if (item === null) {
					item = $(this);
				} else {
					prev = item.offset().left;
					current = $(this).offset().left;
					
					item = (Math.abs(current - 0) < Math.abs(prev - 0) ? $(this) : item);
				}
			});
			
			this._selectedItem = item;
			
			var left = -item.position().left;
			
			console.log("tween did start");
			TweenMax.to(slider, 0.25, {css:{left:left}, ease:Sine.easeIn, onComplete: function() {
				context.didSelectItemListener(item.data("id"));
			}});
		}
		
		this.animate = function() {
			if (this._hasTappedOnItem) {
				this._speed -= 0.00245;
				if (this._speed <= 0.25) { 
					this.animateToSelectedItem();
					return;
				}
			}
					
			switch(this._direction) {
				case "left":
				this.animateLeft();
				break;
				case "right":
				this.animateRight();
				break;
			}
		}
		
		this.animateLeft = function() {
			var context = this;
			var slider = $(this._view.find("ul"));
			
			var left = slider.position().left;
			slider.css({"left": left -= this._speed});
			
			slider.find("li").each(function() {
				var item = $(this);
				
				if (item.offset().left <= -(context._itemWidth)) {
					item.remove();
					slider.append(item);
					slider.css({"left": 0});
				}
			});
		}
		
		this.animateRight = function() {
			var context = this;
			var slider = $(this._view.find("ul"));
			var maxX = this._contentWidth - this._itemWidth;
			
			var left = slider.position().left;
			slider.css({"left": left += this._speed});
			
			slider.find("li").each(function() {
				var item = $(this);
				if (item.offset().left >= (context._itemWidth)) {
					item.remove();
					slider.prepend(item);
					slider.css({"left": -(maxX)});
				}
			})
		}
		
		this.setup = function() {
			var context = this;
			var template = '<div id="'+this._id+'"><ul></ul></div>';
			
			this._container.append(template);
			
			this._view = $("#" + this._id);
			
			this._itemWidth = this._view.width();
			
			$(this._view.find("ul")).on("click", function(){
				context.onItemClicked();
			});

		}
		
		this.init = function(container, rowId) {
			this._container = container;
			this._id = rowId;
			this.setup();
		}
	}
	window.GameRow = GameRow;
}(window));



/*GENERIC  VIEW CONTROLLER*/
(function(window){
	HeaderViewController.prototype = new BaseViewController();
	HeaderViewController.prototype.constructor = HeaderViewController;
	
	function HeaderViewController(){
		this._view;
		this._activeTitle;
		this._playClosure;
		this._top = 18
		
		this.update = function(viewModel) {
			var prevTitle = this._activeTitle;
			var title = "";
			
			title = viewModel.title
						
			var transitionalLabel = $(this._view.find(".transitional-title"));
			transitionalLabel.css({opacity: 1});
			transitionalLabel.html(prevTitle);
			
			var titleLabel = $(this._view.find(".title"));
			titleLabel.css({opacity: 0});
			titleLabel.html(title);
			
			var sandoThumb = $(this._view.find("#sando-thumb"));
						
			if (viewModel.image !== null) {
				sandoThumb.html('<img src="'+viewModel.image+'"/>');
				TweenMax.to(sandoThumb, 0.25, {css:{opacity:1}, ease:Sine.easeIn});
			} else {
				TweenMax.to(sandoThumb, 0.25, {css:{opacity:0}, ease:Sine.easeIn});
			}
						
			TweenMax.to(transitionalLabel, 0.25, {css:{opacity:0}, ease:Sine.easeIn});
			TweenMax.to(titleLabel, 0.25, {css:{opacity:1}, ease:Sine.easeIn});
			
			this._activeTitle = title;
		}
		
		this.setup = function() {
			
		}
		
		this.intro = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;			
			TweenMax.to(this._view, duration, {css:{opacity:1, top: this._top, hidden: false}, ease:Sine.easeIn});
		}
		
		this.exit = function(animated) {
			var duration = (animated === true) ? 0.25 : 0;
			var top = -(this._view.height() / 4);
			TweenMax.to(this._view, duration, {css:{opacity:0, top: top, hidden: true}, ease:Sine.easeIn});
		}
		
		this.baseSetup = function(target) {
			this._view = $(target);
			this.setup();
			this.exit(false);
		}
	}

	window.HeaderViewController = HeaderViewController;
}(window));


/*GENERIC  VIEW CONTROLLER*/
(function(window){
	IntroViewController.prototype = new BaseViewController();
	IntroViewController.prototype.constructor = IntroViewController;
	
	function IntroViewController(){
		this._view;
		this._model;
		this._container;
		this._hasIntialIntro = false;
		this._playButton;
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];			
			console.log(this._model);
			this._container.append(this._model.template);
			
			this._view = $("#" + pageId);
						
			var context = this;
			
			var hero = $(this._view.find("#hero-image"));
			var logo =  $(this._view.find("#intro-logo"));
			var termsButton = $(this._view.find("#terms-button"));
			var playButton =  $(this._view.find("#intro-play-button"));
			console.log(playButton);
			[hero, logo, playButton, termsButton].forEach(function(view) {
				TweenMax.to(view, 0, {scale: 0});
			});
			
			this._playButton = playButton;
		}

		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			if (this._hasIntialIntro) {
				console.log("show it");
				TweenMax.to(this._view, 0.5, {autoAlpha: 1, onComplete: function() {
					if (completion) { completion(); }
				}});
			} else {
				//
				var context = this;
				var hero = $(this._view.find("#hero-image"));
				var logo =  $(this._view.find("#intro-logo"));
				var playButton =  $(this._view.find("#intro-play-button"));
				var termsButton = $(this._view.find("#terms-button"));
				
				var timeline = new TimelineMax();
				
				timeline.to(this._view, 0, {autoAlpha: 1});
				
				timeline.to(hero, 0.5, {scale: 1, ease:Back.easeOut});
				timeline.to(logo, 0.25, {scale: 1, ease:Back.easeOut}, "-=0.10");
				timeline.to(playButton, 0.25, {scale: 1, ease:Back.easeOut},  "-=0.20");
				timeline.to(termsButton, 0.25, {scale: 1, ease:Back.easeOut, onComplete: function() {
					context._hasIntialIntro = true;
					console.log("played");
					if (completion) { completion(); }
				}},  "-=0.20");
				
				timeline.play();
			}
			
		}
		
		this.exit = function(completion) {
			TweenMax.to(this._view, 0.5, {autoAlpha: 0, onComplete: function() {
				if (completion) {
					completion();
				}
			}});
		}
	}

	window.IntroViewController = IntroViewController;
}(window));

/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function IntroCoordinator(){
		this._presenter;
		this._vc;
		this.exitComplete;
		
		this.init = function(model, presenter) {
			this._presenter = presenter;
			this._vc = new IntroViewController();
			this._vc.init(model, presenter);
			
			var context = this;
			
			this._vc._playButton.on("click", function() {
				context.exit();
			});
		}
		
		this.intro = function() {
			var context = this;
			
			TweenMax.to(this._presenter, 0, {autoAlpha: 1, onComplete: function() {
				context._vc.intro();
			}});
		}
		
		this.exit = function() {
			var context = this;
			
			TweenMax.to(this._presenter, 0.5, {autoAlpha: 0, onComplete: function() {
				context.exitComplete();
			}});
		}
	}

	window.IntroCoordinator = IntroCoordinator;
}(window));


/*GENERIC  VIEW CONTROLLER*/
(function(window){
	PreloadViewController.prototype = new BaseViewController();
	PreloadViewController.prototype.constructor = PreloadViewController;
	
	function PreloadViewController(){
		
		this._loader;
		
		this.onImageLoadError = function(e){
			console.log(e);
		}
		
		this.onLoadCompleteReady = function(){
				
		}
		
		this.onImageLoadProgress = function(e){	
			
			console.log("progress", e.loaded * 100);
			var percentage = Math.round(e.loaded * 100);
			
			var loader = $(this._view.find(".preloader-sprite"));
			
			loader.html("loading " + percentage + "%");
			/*var percentage = Math.round(e.loaded * 100);
			
			var clipHeight = 282 - ( 282 * ( percentage / 100 ));
			
			var loaderBar = $(this._view.find(".loader-bar"));
			var loaderPercentage = $(this._view.find(".loader-percentage"));
			var loaderTitle = loaderPercentage.attr("data-title");
					
			loaderBar.css( {clip: "rect(" + clipHeight +"px 282px " + 0 + "282px 0)"});
			
			loaderPercentage.html(loaderTitle + " " + percentage + "%");*/
			
		}
		
		this.onExitComplete = function(){
    		this._view.remove();
		}
	}
	
	PreloadViewController.prototype = {
		init: function(target) {
			this._view = target;
		},
		intro: function(completion) {
			var context = this;
		
			completion();
		},
		exit: function(completion) {
			var context = this;
					
			TweenMax.to(this._view, 0.25, {alpha: 0, delay:0, onComplete:function(){ 
				context.onExitComplete();
				completion();
			}});
		},
		loadContent: function(additionalImages, completion) {
			var context = this;
			
			var images = $("body").find("img");
			var imageArray = [];
			var i;
			
			imageArray.concat(additionalImages);
		
			for(i = 0; i < images.length; i++){
				var image = images[i];
				
				imageArray.push($(images[i]).attr("src"));
			}
			
			var bgImages = [ ];
			var imageUrl;
			
			$("*:not(span,p,h1,h2,h3,h4,h5)").filter(function(){
				if( $(this).css("background-image") != "none" ){
					imageUrl = $(this).css("background-image").replace("url(", "");
					imageUrl = imageUrl.replace(")", "");
					imageUrl = imageUrl.replace('"', "");
					imageUrl = imageUrl.replace('"', "");
										
					if(imageUrl != undefined){
						if( imageUrl.search(".png") == -1 && imageUrl.search(".jpg") == -1 && imageUrl.search(".gif") == -1 ){
						
						}else{
							if(  imageUrl.search("base64") == -1 ){
								if( imageArray.indexOf(imageUrl) == -1 ){
	
									imageArray.push(imageUrl);
								}
							}
						}
					}
					
				}
			});
						
			imageArray = imageArray.filter(function(element){
				return element !== undefined;
			});
			
			if (imageArray.length === 0) {
				completion();
				return;
			}								
			
			this._loader = new createjs.LoadQueue(false);
			
			this._loader.addEventListener("complete",function(e){ completion(e) });
			this._loader.addEventListener("error",function(e){ context.onImageLoadError(e) });
			this._loader.addEventListener("progress",function(e){ context.onImageLoadProgress(e) });
			
			this._loader.loadManifest(imageArray);
			this._hasLoadStart = true;
		}
	}
	
	window.PreloadViewController = PreloadViewController;
}(window));
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
		}
			
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			TweenMax.to(this._view, 0.25, {autoAlpha: 1});
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
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	WinnerModalViewController.prototype = new BaseViewController();
	WinnerModalViewController.prototype.constructor = WinnerModalViewController;
	
	function WinnerModalViewController(){
		this._view;
		this._container;
		this.selectNextListener;
		
		this.setup = function() {
			var context = this;
			this._container.empty();
			this._container.load("templates/winner-modal.html", function() {
				context.onLoad();
			});
		}
		
		this.onLoad = function() {
			var context = this;
			this._view = $(this._container.find(".winner"));
			this._view.find("#winner-next-button").on("click", function() {
				context.selectNextListener();
				context.exit();
			});
		}
			
		this.init = function(container) {
			this._container = container;
			this.setup();
		}
		
		this.intro = function(completion) {
			console.log("winner in ", this._container);
			TweenMax.to(this._container, 0.25, {autoAlpha: 1, onComplete: function(){
				console.log("intro complete");
			}});
		}
		
		this.exit = function(completion) {
			var context = this;
			TweenMax.to(this._container, 0.25, {autoAlpha: 0, onComplete: function() {
				context._container.empty();
			}});
		}
	}
	
	
	window.WinnerModalViewController = WinnerModalViewController;
}(window));