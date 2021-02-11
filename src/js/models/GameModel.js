(function(window){	
	function GameViewModel() {
		this._data;
		
		this.couponData = function() {
			return this._data.coupon;
		}
		
		this.contactData = function() {
			return this._data.contact;
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