//Provides the view for the rest of the application, including the API request for search results

var app = app || {};

app.AppView = Backbone.View.extend({

	el: '#healthApp',

	listTemplate: _.template( $('#calorielist-template').html() ),

	//Events that trigger functions
	events: {
		'keypress #new-food': 'createOnEnter',
		'click #delete-checked': 'deleteChecked',
		'click #toggle-all': 'toggleAllChecked'
	},

	//Initializes the view with listeners for changes to the list
	initialize: function() {
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-food');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(app.Foods, 'add', this.addAll);
		this.listenTo(app.Foods, 'reset', this.addAll);

		this.listenTo(app.Foods, 'all', this.render);

		app.Foods.fetch();
	},

	//When a food is added to the list, makes the footer visible and adds the html element
	render: function() {
		var calorieCount = app.Foods.calorieCount();

		if ( app.Foods.length ) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.listTemplate({
				calorieCount: calorieCount
			}));

		} else {
			this.$main.hide();
			this.$footer.hide();
		}

	},

	//Code for updating the view upon a change to the collection of moedels
	addOne: function( food ) {
		var view = new app.FoodView({ model: food });
		$('#foods').append( view.render().el );
	},

	//Code for updating the entire list when the app is loaded
	addAll: function() {
		this.$('#foods').html('');
		app.Foods.each(this.addOne, this);
	},

	//Function to handle input from the search box and call the Nutritionix API
	createOnEnter: function( event ) {
		if (event.which !== ENTER_KEY || !this.$input.val().trim() ) {
			return;
		}

		//Set variables necessary for the AJAX call
		var id = '957c539e';
		var key = '11b418d26e58ab2b327b0febb0e2b79f';
		var query = this.$input.val().trim();
		//The paramaters of the url are set for 10 search results
		var url = 'https://api.nutritionix.com/v1_1/search/' + query + '?results=0:10&fields=brand_name%2Citem_name%2Cbrand_id%2Citem_id%2Cnf_calories&appId=' + id + '&appKey=' + key;

		$.ajax({
			'url': url,
			'dataType': 'json',
			'success': function(data, textStats, XMLHttpRequest) {
				//Empty the searchresults div and show it
				$( "#searchresults" ).html('');
				$( "#searchresults" ).show();
				//Cycle through the search results to display them and add a click handler
				for (var i = 0; i < data.hits.length; i++) {
					var hit = data.hits[i].fields;
					console.log(hit);
					var name = hit.brand_name + ' - ' + hit.item_name;
					var calories = hit.nf_calories;
					var quantity = String(hit.nf_serving_size_qty) + ' ' + hit.nf_serving_size_unit;
					//Add the item to the display
					$( '#searchresults').append('<li class="list-group-item">' + name + ' - ' + calories + ' calories -' + quantity + '</li>');
					//Add the click handler
					$( 'li:last' ).on('click', (function(name, calories) {
						return function() {
							//Hide the searchresults div again
							$( '#searchresults' ).hide();
							//Create a new food with the API info selected
							app.Foods.create({
								name: name,
								calories: calories,
								checked: false,
								quantity: quantity
							});
							//Reset the search box
							this.$input.val('');
						};
					})(name, calories));
				}
			},
			//Error Handling
			'error': function() {
				alert('There was a problem talking to Nutritionix. Please try again later!');
			}
		});
	},

//Delete checked items (called when the delete button is clicked)
	deleteChecked: function() {
		_.invoke(app.Foods.checked(), 'destroy');
      return false;
	},

//When the select all button is clicked, checks or unchecks the checkboxes on the list
	toggleAllChecked: function() {
		var checked = this.allCheckbox.checked;
		app.Foods.each(function( food ) {
			food.save({
				'checked': checked
			});
		});
	}
});

