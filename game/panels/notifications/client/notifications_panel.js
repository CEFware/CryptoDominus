Template.notifications_panel.helpers({
	notifications_type: function() {
		return Session.get('notifications_type')
	},

	mine_active: function() {
		if (Session.get('notifications_type') == 'notifications_mine') {
			return 'active'
		} else {
			return ''
		}
	},

	global_active: function() {
		if (Session.get('notifications_type') == 'notifications_global') {
			return 'active'
		} else {
			return ''
		}
	},

	battls_active: function() {
		if (Session.get('notifications_type') == 'notifications_battles') {
			return 'active'
		} else {
			return ''
		}
	},

	game_end_date: function() {
		Session.get('refresh_time_field')
		return moment(new Date(s.game_end)).calendar()
	},

	time_until_game_end: function() {
		Session.get('refresh_time_field')
		return moment.duration(moment(new Date(s.game_end)) - moment()).humanize()
	}
})


Template.notifications_panel.events({
	'click #show_mine_tab': function(event, template) {
		Session.set('notifications_type', 'notifications_mine')
	},

	'click #show_global_tab': function(event, template) {
		Session.set('notifications_type', 'notifications_global')
	},

	'click #show_battles_tab': function(event, template) {
		Session.set('notifications_type', 'notifications_battles')
	}
})


Template.notifications_panel.rendered = function() {
	Session.set('notifications_show_mine', true)
	logevent('panel', 'open', 'notifications')
}