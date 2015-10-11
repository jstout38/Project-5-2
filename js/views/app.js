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

		app.Foods.create( this.newAttributes() );
		this.$input.val('');
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

