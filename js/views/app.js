var app = app || {};

app.AppView = Backbone.View.extend({

	el: '#healthApp',

	listTemplate: _.template( $('#calorielist-template').html() ),

	events: {
		'keypress #new-food': 'createOnEnter',
		'click #delete-checked': 'deleteChecked',
		'click #toggle-all': 'toggleAllChecked'
	},

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

	addOne: function( food ) {
		var view = new app.FoodView({ model: food });
		$('#foods').append( view.render().el );
	},

	addAll: function() {
		this.$('#foods').html('');
		app.Foods.each(this.addOne, this);
	},

	newAttributes: function() {
		return {
			name: this.$input.val().trim(),
			order: app.Foods.nextOrder(),
			//API for calories goes here
			calories: 0
		};
	},

	createOnEnter: function( event ) {
		if (event.which !== ENTER_KEY || !this.$input.val().trim() ) {
			return;
		}

		//app.Foods.create( this.newAttributes() );
		//this.$input.val('');

		var id = '957c539e';
		var key = '11b418d26e58ab2b327b0febb0e2b79f';
		var query = this.$input.val().trim();
		var url = 'https://api.nutritionix.com/v1_1/search/' + query + '?results=0:10&fields=brand_name%2Citem_name%2Cbrand_id%2Citem_id%2Cnf_calories&appId=' + id + '&appKey=' + key;

		$.ajax({
			'url': url,
			'dataType': 'json',
			'success': function(data, textStats, XMLHttpRequest) {
				console.log(data);
				$( "#searchresults" ).html('');
				$( "#searchresults" ).show();
				for (var i = 0; i < data.hits.length; i++) {
					var hit = data.hits[i].fields;
					console.log(hit);
					var name = hit.brand_name + ' - ' + hit.item_name;
					var calories = hit.nf_calories;
					$( '#searchresults').append('<li class="list-group-item">' + name + ' - ' + calories + ' calories</li>');
					$( 'li:last' ).on('click', (function(name, calories) {
						return function() {
							$( '#searchresults' ).hide();
							app.Foods.create({
								name: name,
								calories: calories,
								checked: false
							});
							this.$input.val('');
						}
					})(name, calories));
				}
			},
			//Error Handling
			'error': function() {
				alert('There was a problem talking to Nutritionix. Please try again later!');
			}
		});
	},


	deleteChecked: function() {
		_.invoke(app.Foods.checked(), 'destroy');
      return false;
	},

	toggleAllChecked: function() {
		var checked = this.allCheckbox.checked;

		app.Foods.each(function( food ) {
			food.save({
				'checked': checked
			});
		});
	}
});

