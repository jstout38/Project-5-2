var app = app || {};

app.FoodView = Backbone.View.extend({

	tagname: 'li',

	template: _.template( $('#item-template').html() ),

	events: {
		'click .toggle': 'toggleCheck',
		'click .glyphicon': 'clear'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

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