
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	function App(){
		
		this._deviceType;
		this._preloader;
		this._data;
		this._game;
		
		this.loadScripts = function(e){
			var context = this;
			
			$.getScript("https://code.createjs.com/preloadjs-0.6.2.min.js", function(){
				$.getScript("https://code.createjs.com/createjs-2015.11.26.min.js", function(){
					context.loadGame();
				});
			});
			
		};
		
		this.loadGame = function() {
			var context = this;
			
			var header = new HeaderViewController();
			header.init($("#app-header"));
			
			var footer = new FooterViewController();
			footer.init($("#app-footer"));
			
			$(".page-slider").find(".page").each(function(){
				if ($(this).is("#intro") === false) {
					var headerHeight = header._view.outerHeight() + header._top;
					var footerHeight = header._view.outerHeight();
					var containerHeight = $(".page-container").height() - headerHeight - footerHeight;
					console.log(containerHeight);
					$(this).css({
						"margin-top": headerHeight,
						"height": containerHeight
					});
					/*$(this).css({
						"padding-top": headerHeight,
						"padding-bottom": footerHeight
					});*/
				}
			});
    		
    		this._game = new GameCoordinator();
    		this._game.init($(".page-container"), this._deviceType, header, footer);
    	    		    		
    		this._game.load(function() {
	    		context.loadContent();
    		});
		}

		this.loadContent = function(){
    		var context = this;
    		
			this._preloader = new PreloadViewController();
			this._preloader.init($(".preloader"));
			
            $(this._preloader).on("onExitComplete", function(e){ context.onPreloaderExitComplete(e); });
             
			this._preloader.intro(function() {
				context._preloader.loadContent(context._game.gameImages(), function(e){
					context._preloader.exit(function(e) {
						//context.onLoadContentComplete(e);
					});
				});
			});
		};
				
		this.onLoadContentComplete = function(e){
    		console.log("I have it all now i can start");
    		
    		this.onWindowResize();
			           
        };
		
		this.onPreloaderExitComplete = function(e){
    		console.log("preloader exit complete");
		};
		
		this.intro = function(){
			
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

/*GENERIC  VIEW CONTROLLER*/
(function(window){
	
	function BaseViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.onCloseButtonClick = function(e){
			this.exit();
		}
		
		this.intro = function(){
			this._view.css({"opacity" : 1});
		}
		
		this.onIntroComplete = function(){
			$(this).trigger("onIntroComplete");
		}
		
		this.exit = function(){
			this._view.css({"opacity" : 0});
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
		dealloc:function(){
			if(this._pageContent){
				this._pageContent.remove();
			}
			
			this._pageContent = null;
			this._view = null;
			this._deviceType = null;
			this._model = null;
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
		this.selectLevelListener;
		
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
				context.selectLevelListener($(this).data("id"));
			})
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
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
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	CountdownViewController.prototype = new BaseViewController();
	CountdownViewController.prototype.constructor = CountdownViewController;
	
	function CountdownViewController(){
		this._view;
		this.introCompleteListener;
		this.exitCompleteListener;
		this._numbers = [];
		this._index = 0;
		
		this.intro = function() {
			var context = this;
			this._view.css({
				"opacity": 0,
				"display": "block"
			})
			TweenMax.to(this._view, 0.25, {alpha: 1, delay:0, onComplete:function(){ 
				context.introCompleteListener();
				context.countdown();
			}});
		}	
		
		this.exit = function() {
			var context = this;
			TweenMax.to(this._view, 0.25, {alpha: 0, delay:0, onComplete:function(){ 
				context._view.css({"display": "none"});
				context.exitCompleteListener();
			}});
		}
		
		this.countdown = function() {
			var context = this;
			var tl = new TimelineMax({onComplete: function() {
				context.exit();
			}});
			console.log(tl);
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
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	FooterViewController.prototype = new BaseViewController();
	FooterViewController.prototype.constructor = FooterViewController;
	
	function FooterViewController(){
		this._view;
		
		this.nextClosure;
		this.backClosure;
		
		this.update = function(step) {
			
		}
		
		this.setup = function() {
			var context = this;
			$(this._view.find("#back-button")).on("click", function() {
				context.backClosure();
			});
			
			$(this._view.find("#next-button")).on("click", function() {
				context.nextClosure();
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
			return levels.find(level => { return level.id === id; });
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
		
		this.endGamePlay = function(success) {
			if (success) {
				this.presentSuccessMessage();
			} else {
				this.presentFailureMessage();
			}
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
						vc.didFinishGameListener = function(success) {
							context.endGamePlay(success);
						}
						context._viewControllers.push(vc);
						break;
				}
			});
		}
		
		this.presentSuccessMessage = function() {
			var modal = $(".modal");
			modal.css({"display": "block", "opacity": 0});
			
			TweenMax.to(modal, 0.25, {alpha: 1});
		}
		
		this.presentFailureMessage = function() {
			console.log("you've lost!!")
		}
		
		this.onNextButtonTap = function() {
			if (this._currentStep == this._viewControllers.count - 1) { return; }
			
			var preVC = this._viewControllers[this._currentStep];
			
			this._currentStep ++;
			
			var vc = this._viewControllers[this._currentStep];
			
			if (vc instanceof ChooseSandwichViewController) {
				vc.update(this._game.sandwiches);
			}
			
			preVC.exit();
			vc.intro();
			
			if (this._currentStep > 0) {
				this._header.intro(true);
				this._footer.intro(true);
			}
			
			var sandwichThumb = null;
			
			if (vc instanceof GameViewController) {
				sandwichThumb = this._game.sandwich.thumbnail;
				this.presentCountdown()
			} else {
				this.presentNextScreen();
			}
		}
		
		this.presentNextScreen = function() {
			var sandwichThumb = (this._game.sandwich !== null) ? this._game.sandwich.thumbnail : null;
			var left = -(this._view.width() * this._currentStep);
			this._header.update(this._model.steps[this._currentStep], sandwichThumb);
			TweenMax.to(this._slider, 0.35, {css:{left:left}, ease:Sine.easeInOut});
		}
		
		this.presentCountdown = function() {
			var context = this;
			var vc = new CountdownViewController();
			vc.init($("#game-countdown"));
			vc.introCompleteListener = function() {
				context.presentNextScreen();
			}
			vc.exitCompleteListener = function() {
				
			}
			
			
			vc.intro();
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
		
		this.didFinishGameListener;
		
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
		
		this.reset = function() {
			this._game = null;
			if (this._timer !== null && this._timer !== undefined) {
				clearInterval(this._timer);
			}
			this._timer = null;
			this._selectedIds = [];
		}
		
		this.finishGame = function() {
			clearInterval(this._timer);
			this._timer = null;
			
			var componentsMatch = this._selectedIds.every(id => id === this._selectedIds[0]);
			
			if (componentsMatch && this._game.sandwich.id === this._selectedIds[0]) {
				this.didFinishGameListener(true);
			} else {
				this.didFinishGameListener(false);
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
		
		this.update = function(step, sandwichThumb) {
			var prevTitle = this._activeTitle;
			var title = "";
			
			title = step.title
						
			var transitionalLabel = $(this._view.find(".transitional-title"));
			transitionalLabel.css({opacity: 1});
			transitionalLabel.html(prevTitle);
			
			var titleLabel = $(this._view.find(".title"));
			titleLabel.css({opacity: 0});
			titleLabel.html(title);
			
			var sandoThumb = $(this._view.find("#sando-thumb"));
						
			if (sandwichThumb !== null) {
				sandoThumb.html('<img src="'+sandwichThumb+'"/>');
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
	HowToViewController.prototype = new BaseViewController();
	HowToViewController.prototype.constructor = HowToViewController;
	
	function HowToViewController(){
		this._view;
		this._pageContent;
		this._deviceType;
		this._model;
		
		this.baseSetup = function(target, model, deviceType) {
			this._view = $(target);
			this._model = model;
			this._deviceType = deviceType;
		}
	}
	
	
	window.HowToViewController = HowToViewController;
}(window));
/*GENERIC  VIEW CONTROLLER*/
(function(window){
	IntroViewController.prototype = new BaseViewController();
	IntroViewController.prototype.constructor = IntroViewController;
	
	function IntroViewController(){
		this._view;
		this.playButtonListener;
		this._model;
		this._container;
		
		this.setup = function() {
			var context = this;
			var pageId = this._model['page-id'];
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><div class="hero-title"><img src="img/content/home-hero.png" alt="Total Day Maker"/></div><div class="hero-content"><div class="logo"><img src="img/content/daves-logo.png" alt="Daves Bread"/></div><!------><div class="play-button"><img src="img/content/home-play-btn.png" alt="Play for Bread"/></div></div><div class="terms"><a href="">TERMS AND CONDITIONS</a></div></div></div>';
			
			this._container.append(template);
			
			this._view = $("#" + pageId);
			
			
			$(this._view.find(".play-button")).on("click", function() {
				context.playButtonListener();
			});
		}
		
		this.init = function(model, container) {
			this._model = model;
			this._container = container;
			this.setup();
		}
	}

	window.IntroViewController = IntroViewController;
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