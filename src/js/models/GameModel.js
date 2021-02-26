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
		
		this.affirmations = function() {
			return this._data.affirmations;
		}
		
		this.colors = function() {
			return this._data.colors;
		}
		
		this.completionMessage = function(success) {
			return (success) ? this.randomWinnerMessage() : this.randomLoseMessage();
		}
		
		this.randomWinnerMessage = function() {
			return this._data.win_messaging[Math.floor(Math.random() * this._data.win_messaging.length)];
		}
		
		this.randomLoseMessage = function() {
			return this._data.lose_messaging[Math.floor(Math.random() * this._data.lose_messaging.length)];
		}
		
		this.randomAffirmations = function(count) {
			var aff = [];
			var colors = []
			
			while (count > aff.length) {
				var item = this.affirmations()[Math.floor(Math.random() * this.affirmations().length)];
				var color = this.colors()[Math.floor(Math.random() * this.colors().length)];
				
				if (!aff.includes(item) && !colors.includes(color)) {
					aff.push(item);
					colors.push(color);
				}
			}	
			
			var itemsToReturn = [];
			
			for (var i = 0; i < aff.length; i++) {
				var item = aff[i];
				var color = colors[i];
				itemsToReturn.push({"text": item, "type": "text", "color": color});
			}
						
			return itemsToReturn;
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
				
				var recipe = sandwich.recipe;
				
				images.push(recipe.hero);
				images.push(recipe.detail);
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