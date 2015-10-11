var app = app || {};

app.Food = Backbone.Model.extend ({

	defaults: {
		name: '',
		calories: 0,
		checked: false,
		quantity: ''
	},

	toggle: function() {
		this.save({
			checked: !this.get('checked')
		});
	}

});