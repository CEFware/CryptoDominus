Template.not_new_lord.helpers({
	vars: function() {
		return this.vars
	}
})

Template.not_new_lord.events({
	'click .not_not_new_lord_goto': function() {
		center_on_hex(this.vars.x, this.vars.y)
		Session.set('selected_type', 'castle')
		Session.set('selected_id', this.vars.castle_id)
	}
})