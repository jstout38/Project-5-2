//Adds newly created foods to the list of foods using the template provided in index.html

var app = app || {};

app.FoodView = Backbone.View.extend({

	tagname: 'li',

	template: _.template( $('#item-template').html() ),

	//Tells backbone what to do on click events
	events: {
		'click .toggle': 'toggleCheck',
		'click .glyphicon': 'clear'
	},

	//Initialize the view and tell it what to listen for
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	//Update the list using the template
	render: function() {
		this.$el.html( this.template( this.model.attributes ) );

		return this;
	},

	toggleCheck: function() {
		this.model.toggle();
	},

	clear: function() {
		this.model.destroy();
	}

});