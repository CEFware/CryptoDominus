Template.summary_hover_box.helpers({
	left: function() {
		return $('#left_panel').width() + 20
	},

	top: function() {
		return Session.get('summary_hover_box_top')
	},

	draw: function() {
		return Session.get('show_summary_hover_box')
	},

	contents: function() {
		return Session.get('summary_hover_box_contents')
	}
})