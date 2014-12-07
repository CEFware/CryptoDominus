Template.lp_armies.helpers({
	armies: function() {
		Session.get('refresh_time_field')
		var res = LeftPanelArmies.find({}, {sort: {name: 1}})
		if (res && res.count() > 0) {
			res = res.map(function(a) {
				// movement
				var moves = Moves.find({army_id:a._id})
				if (moves.count() > 0) {
					a.is_moving = true
					var army_speed = speed_of_army(a)

					var distance = 0
					var last_move_at
					moves.forEach(function(move) {
						if (move.index == 0) {
							var d = Hx.hexDistance(a.x, a.y, move.to_x, move.to_y)
							last_move_at = move.last_move_at
						} else {
							var d = Hx.hexDistance(move.from_x, move.from_y, move.to_x, move.to_y)
						}
						distance += d
					})

					var move_time = moment(new Date(last_move_at)).add(distance * army_speed, 'minutes')
					if (move_time < moment()) {
						a.time_to_destination = 'soon'
					} else {
						a.time_to_destination = move_time.fromNow()
					}


				} else {
					a.is_moving = false
				}

				a.unit_count = 0
				_.each(s.army.types, function(type) {
					a.unit_count += a[type]
				})
				
				return a
			})
			return res
		} else {
			return false
		}
	},
})


Template.lp_armies.created = function() {
	this.autorun(function() {
		Meteor.subscribe('left_panel_armies')
		Meteor.subscribe('user_moves')
	})
}