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
		this._rows = [];
		this._selectedIds = [];
		this._shouldAnimate = false;
		
		this.didFinishGame;
		
		this.reset = function() {	
			this._shouldAnimate = false;
			
			this._game = null;
			
			this._selectedIds = [];
	
			this._rows.forEach(function(row){
				row.reset();
			});
		}
		
		this.start = function() {
			var context = this;
			this._shouldAnimate = true;
			
			window.requestAnimationFrame(animate);
			
			function animate() {
				if (context._shouldAnimate) {
					context._rows.forEach(function(row){
						row.animate();
				
					});
					window.requestAnimationFrame(animate);
				}
			}
		}
				
		this.update = function(game) {
			this.reset();
			
			this._game = game;
			
			var speed = this._game.level.speed;
			var tolerance = this._game.level.tolerance;
			var sandwiches = this._game.sandwiches;
			var affirmations = this._game.affirmations;
			
			this._rows.forEach(function(row){
				var animationSpeed = speed + Math.random() * ((tolerance - 0.01) + tolerance) ;
				switch(row._id) {
					case "top":
					var items = sandwiches.map(function(a){
						return {"image": a.top, "id": a.id, "type": "sando"}
					});
					row.update(items, "left", animationSpeed, 0.234275);
					break;
					case "middle":
					var items = sandwiches.map(function(a){
						return {"image": a.middle, "id": a.id, "type": "sando"}
					});
					
					affirmations.forEach(function(affirmation) {
						items.push(affirmation);
					});
					
					items = items.sort(function(a, b){return 0.5 - Math.random()});

					row.update(items, "right", speed, 0.375);
					break;
					case "bottom":
					var items = sandwiches.map(function(a){
						return {"image": a.bottom, "id": a.id, "type": "sando"}
					});
					row.update(items, "left", animationSpeed,  0.1875);
					break;
				}
			});
			
			this.start();
		}

		this.finishGame = function() {
			this._shouldAnimate = false;
			
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
			
			var template = '<div class="page" id="' + pageId + '"><div class="page-content"><p>Tap each row to stop the sliding. Time your taps to land on the correct pieces. No match? No worries — play again!</p><div id="game-carousel" class="carousel"></div></div></div>';
			
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
		
		this.onOrientationChange = function(e){	
			this._rows.forEach(function(row){
				row.onOrientationChange(e);
			});
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
		this._heightMultiplier;
		
		this.didSelectItemListener;
		
		this.update = function(items, direction, speed, heightMultiplier) {
			this.reset();
			
			var context = this;
			
			var slider = $(this._view.find("ul"));
			items.forEach(function(item) {
				switch(item.type) {
					case "sando":
					slider.append('<li class="tile" data-id="'+item.id+'"><img src="'+item.image+'"/></li><!-- -->');
					break;
					case "text":
					slider.append('<li style="background: ' + item.color + ';" class="tile affirmation"><span>' + item.text + '</span></li><!-- -->');
					break;
					case "sticker":
					break
				}
			});
						
			this._direction = direction;
			this._items = items;
			this._speed = speed;
			this._heightMultiplier = heightMultiplier
						
			this.updateLayout();
			
		}
		
		this.updateLayout = function() {
			var context = this;
			var slider = $(this._view.find("ul"));
			
			this._itemWidth = this._view.width();
			this._contentWidth = this._itemWidth * this._items.length;
			
			var height = this._itemWidth * this._heightMultiplier;
			
			this._view.css({"height": height});
		
			slider.css({"width": this._contentWidth});
			
			slider.find("li").each(function() {
				$(this).css({"width": context._itemWidth, "height": height });
			})
			
			if (this._direction === "right") {
				slider.css({"left": -(this._contentWidth - this._itemWidth)});
			}
		}
		
		this.reset = function() {
			this._direction = null;
			this._speed = null;
			this._contentWidth = null;
			this._hasTappedOnItem = false;
			this._selectedItem = null;
			this._heightMultiplier = null;
			
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
				this._speed -= 0.0345;
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
			});
		}
		
		this.setup = function() {
			var context = this;
			var template = '<div id="'+this._id+'"><ul></ul></div>';
			
			this._container.append(template);
			
			this._view = $("#" + this._id);
			
			
						
			$(this._view.find("ul")).on("mouseup touchend", function(){
				context.onItemClicked();
			});
		}
		
		this.init = function(container, rowId) {
			this._container = container;
			this._id = rowId;
			this.setup();
		}
		
		this.onOrientationChange = function(e){	
			this.updateLayout();
		}
	}
	window.GameRow = GameRow;
}(window));


