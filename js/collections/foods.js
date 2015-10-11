//Collection to hold the list of foods
//Each collection contains several app.Food models and writes them to local storage
//Helper functions are also present to count the calories within the collection, produce an array
//of checked items, and keep the list in order

var app = app || {};

var Foods = Backbone.Collection.extend({

	model: app.Food,

	localStorage: new Backbone.LocalStorage('foods-backbone'),

	//Returns the total calorie count of teh collection
	calorieCount: function() {
		var total = 0;
		this.each( function( food ) {
			var calories = food.get('calories');
			total += calories;
		});
		return total;
	},

	//Returns an array of checked items
	checked: function() {
		return this.filter(function( food ) {
			return food.get('checked');
		});
	},

    nextOrder: function() {
      if ( !this.length ) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    comparator: function( food ) {
      return food.get('order');
    }

});

app.Foods = new Foods();