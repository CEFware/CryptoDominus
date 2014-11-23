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
	},

	is_game_end_set: function() {
		var end = Settings.findOne({name: 'gameEndDate'})
		if (end && end.value != null) {
			return true
		} else {
			return false
		}
	},

	time_til_game_end_when_new_dominus: function() {
		return moment.duration(s.time_til_game_end_when_new_dominus).humanize()
	},

	game_end_date: function() {
		var end = Settings.findOne({name: 'gameEndDate'})
		return end.value
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
	logevent('panel', 'open', 'notifications')
	this.autorun(function() {
		Meteor.subscribe('gameEndDate')
	})
}



get_notification_icon = function(notification_type) {
	switch (notification_type) {
		case 'battle':
			return 'fa-shield'
		case 'battle_start':
			return 'fa-shield'
		case 'gained_vassal':
			return 'fa-sign-in'
		case 'lost_vassal':
			return 'fa-sign-out'
		case 'new_chatroom_kings':
			return 'fa-comment'
		case 'new_chatroom_lords':
			return 'fa-comment'
		case 'new_chatroom_user':
			return 'fa-comment'
		case 'new_lord':
			return 'fa-sitemap'
		case 'no_longer_a_king':
			return 'fa-sitemap'
		case 'no_longer_dominus':
			return 'fa-sitemap'
		case 'no_longer_dominus_new_user':
			return 'fa-sitemap'
		case 'now_a_king':
			return 'fa-sitemap'
		case 'now_dominus':
			return 'fa-sitemap'
		case 'sent_army':
			return 'fa-envelope'
		case 'sent_gold':
			return 'fa-money'
	}
}