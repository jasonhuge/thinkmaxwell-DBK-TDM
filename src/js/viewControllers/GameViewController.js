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
			var tolerance = this._game.level.tolerance;
			var sandwiches = this._game.sandwiches;
			
			this._rows.forEach(function(row){
				var animationSpeed = speed + Math.random() * ((tolerance - 0.01) + tolerance) ;
				switch(row._id) {
					case "top":
					var items = sandwiches.map(function(a){
						return {"image": a.top, "id": a.id, "type": "sando"}
					});
					row.update(items, "left", animationSpeed);
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
					row.update(items, "left", animationSpeed);
					break;
				}
			});
			
			this.start();
		}

		this.finishGame = function() {
			clearInterval(this._timer);
			this._timer = null;
			
			var componentsMatch = this._selectedIds.every(id => id === this._selectedIds[0]);
			
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


