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
		this._hasClicked = false;
		
		this.update = function(items, direction, speed) {
			var context = this;
			var slider = $(this._view.find("ul"));
			slider.empty();
			
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
		
		this.onItemClicked = function(){
			console.log("clicked");
			this._hasClicked = true;
		}
		
		this.animate = function() {
			if (this._hasClicked) {
				this._speed -= 0.00245;
				if (this._speed < 0) { this._speed = 0 }
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


