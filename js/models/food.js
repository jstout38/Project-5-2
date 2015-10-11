// The basic model for foods
// Each food contains a name, a calorie amount, a boolean variable for whether it's checked, and
// a string that describes the quantity. Other than checked all of these fields will be pulled from
// the Nutritionix API

var app = app || {};

//Create a Food model based on the Backbone model
app.Food = Backbone.Model.extend ({

	defaults: {
		name: '',
		calories: 0,
		checked: false,
		quantity: ''
	},

	//Helper function to change the checked status
	toggle: function() {
		this.save({
			checked: !this.get('checked')
		});
	}

});