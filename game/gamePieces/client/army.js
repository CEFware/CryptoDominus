Template.army.helpers({
	//only draw guy that has been there the longest
	draw: function() {
		var self = this
		var draw = true
		Armies.find({x: self.x, y: self.y, _id: {$ne: self._id}}, {fields: {last_move_at:1}}).forEach(function(res) {
			if (self.last_move_at > res.last_move_at) {
				draw = false
			}
		})
		return draw
	}
})



Template.army.events({
	'click .army': function(event, template) {
		if (!Session.get('is_dragging_hexes')) {

			if (Session.get('mouse_mode') == 'default') {
				Session.set('selected_type', 'army')
				Session.set('selected_id', Template.currentData()._id)
			}

		}
	},

	'mouseenter .army': function(event, template) {
		//if (Session.get('mouse_mode') == 'default') {
			Session.set('hover_box_data', {type: 'army', x: Template.currentData().x, y: Template.currentData().y})
			Meteor.clearTimeout(Session.get('hover_on_object_timer'))
			Session.set('hover_on_object', true)
		//}
	},

	'mouseleave .army': function(event, template) {
		Meteor.clearTimeout(Session.get('hover_on_object_timer'))
		Session.set('hover_on_object_timer', Meteor.setTimeout(function() { Session.set('hover_on_object', false) }, 1000))
	},
})


Template.army.created = function() {
	var self = this

	this.autorun(function() {
		Session.get('update_highlight')
		var mouse_mode = Deps.nonreactive(function () { return Session.get('mouse_mode'); })
		if (mouse_mode != 'finding_path') {
			if (Session.get('selected_type') == 'army') {
				var selected_id = Session.get('selected_id')
				if (selected_id == self.data._id) {
					Session.set('rp_template', 'rp_info_army')
				}
			}
		}
	})
}



draw_army_highlight = function(army_id) {
	check(army_id, String)
	$('.army_highlight[data-id='+army_id+']').show()
}


remove_army_highlights = function() {
	$('.army_highlight').hide()
}
