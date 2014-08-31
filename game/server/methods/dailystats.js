update_networth = function(user_id) {

	var user = Meteor.users.findOne(user_id)

	if (!user) { return false }

	if (isNaN(user.gold) || !isFinite(user.gold)) {return false}
	if (isNaN(user.grain) || !isFinite(user.grain)) {return false}
	if (isNaN(user.lumber) || !isFinite(user.lumber)) {return false}
	if (isNaN(user.ore) || !isFinite(user.ore)) {return false}
	if (isNaN(user.wool) || !isFinite(user.wool)) {return false}
	if (isNaN(user.clay) || !isFinite(user.clay)) {return false}
	if (isNaN(user.glass) || !isFinite(user.glass)) {return false}

	var worth = {
		gold: user.gold,
		grain: user.grain,
		lumber: user.lumber,
		ore: user.ore,
		wool: user.wool,
		clay: user.clay,
		glass: user.glass
	}

	var fields = {}
	_.each(s.army.types, function(type) {
		fields[type] = 1
	})

	// armies
	Armies.find({user_id: user._id}, {fields: fields}).forEach(function(army) {
		_.each(s.resource.types, function(t) {
			_.each(s.army.types, function(type) {
				worth[t] += s.army.cost[type][t] * army[type]
			})
		})
	})

	// villages and village garrison
	Villages.find({user_id: user._id}, {fields: fields}).forEach(function(res) {
		_.each(s.resource.types, function(t) {
			worth[t] += s.village.cost[t]

			_.each(s.army.types, function(type) {
				worth[t] += s.army.cost[type][t] * res[type]
			})
		})
	})

	// castle garrison
	Castles.find({user_id: user._id}, {fields: fields}).forEach(function(res) {
		_.each(s.resource.types, function(t) {
			_.each(s.army.types, function(type) {
				worth[t] += s.army.cost[type][t] * res[type]
			})
		})
	})

	worth.total = worth.gold

	// convert to gold
	_.each(s.resource.types, function(t) {
		var m = Market.findOne({type: t}, {fields: {price: 1}})
		if (!m) { return false }
		worth.total += m.price * worth[t]
	})

	if (!isFinite(worth.total) || isNaN(worth.total)) {
		return false
	}

	var begin = moment().startOf('day').toDate()
	var end = moment().add('days', 1).startOf('day').toDate()

	Dailystats.upsert({user_id: user_id, created_at: {$gte: begin, $lt: end}}, {$setOnInsert: {user_id:user_id, created_at: new Date()}, $set: {networth:worth.total, updated_at:new Date()}})
	Meteor.users.update(user_id, {$set: {networth: worth.total}})
}



update_losses_worth = function(user_id) {

	var user = Meteor.users.findOne(user_id, {fields: {losses:1}})
	if (user) {
		var worth = {gold: 0}

		_.each(s.resource.types, function(t) {
			worth[t] = 0
		})

		_.each(s.resource.types, function(t) {
			_.each(s.army.types, function(type) {
				if (user.losses[type]) {
					worth[t] += s.army.cost[type][t] * user.losses[type]
				}
			})
		})

		worth.total = worth.gold

		// convert to gold
		_.each(s.resource.types, function(t) {
			var m = Market.findOne({type: t}, {fields: {price: 1}})
			if (!m) { return false }
			worth.total += m.price * worth[t]
		})

		if (!isFinite(worth.total) || isNaN(worth.total)) {
			return false
		}

		var begin = moment().startOf('day').toDate()
		var end = moment().add('days', 1).startOf('day').toDate()

		Dailystats.upsert({user_id: user_id, created_at: {$gte: begin, $lt: end}}, {$setOnInsert: {user_id:user_id, created_at: new Date()}, $set: {losses_worth:worth.total, updated_at:new Date()}})
		Meteor.users.update(user_id, {$set: {losses_worth: worth.total}})
	}
}






// inc_daily_stats = function(user_id, new_stats, add_to) {
// 	check(user_id, String)
// 	check(new_stats, Object)
// 	check(add_to, Boolean)
	
// 	var begin = moment().startOf('day').toDate()
// 	var end = moment().add('days', 1).startOf('day').toDate()

// 	var stat = Dailystats.findOne({user_id: user_id, created_at: {$gte: begin, $lt: end}})

// 	if (!stat) {
// 		var stat = {
// 			user_id: user_id,
// 			created_at: new Date(),
// 			updated_at: new Date(),
// 			income: {
// 				gold: 0,
// 				grain: 0,
// 				lumber: 0,
// 				ore: 0,
// 				wool: 0,
// 				clay: 0,
// 				glass: 0
// 			},
// 			vassal_income: {
// 				gold: 0,
// 				grain: 0,
// 				lumber: 0,
// 				ore: 0,
// 				wool: 0,
// 				clay: 0,
// 				glass: 0
// 			},
// 			networth: 0
// 		}
// 		stat._id = Dailystats.insert(stat)
// 	}

// 	if (!_.isEmpty(new_stats)) {

// 		_.each(new_stats, function(value, key) {
// 			if (_.isObject(value)) {
// 				_.each(value, function(nValue, nKey) {
// 					if (isNaN(nValue)) {
// 						throw new Meteor.Error(0, 'passed dailystat is not a number. key: '+nKey+' value: '+nValue)
// 					}
// 					if (add_to) {
// 						stat[key][nKey] += nValue
// 					} else {
// 						stat[key][nKey] = nValue
// 					}
// 				})
// 			} else {
// 				if (isNaN(value)) {
// 					throw new Meteor.Error(0, 'passed dailystat is not a number key: '+key+' value: '+value)
// 				}
// 				if (add_to) {
// 					stat[key] += value
// 				} else {
// 					stat[key] = value
// 				}
// 			}
// 		})

// 		stat.updated_at = new Date()

// 		Dailystats.update(stat._id, stat)
// 	}
// }



// set_networth = function(user_id, networth) {
// 	check(user_id, String)
// 	check(networth, Number)

// 	var begin = moment().startOf('day').toDate()
// 	var end = moment().add('days', 1).startOf('day').toDate()

// 	Deailystats.upsert({user_id: user_id, created_at: {$gte: begin, $lt: end}}, {$setOnInsert: {created_at: new Date()}, $set: {networth:networth, updated_at:new Date()}})
// 	Meteor.users.update(user_id, {$set: {networth: networth}})
// }


init_dailystats_for_new_user = function(user_id) {
	var stat = {
		user_id: user_id,
		created_at: new Date(),
		updated_at: new Date(),
		income: {
			gold: 0,
			grain: 0,
			lumber: 0,
			ore: 0,
			wool: 0,
			clay: 0,
			glass: 0
		},
		vassal_income: {
			gold: 0,
			grain: 0,
			lumber: 0,
			ore: 0,
			wool: 0,
			clay: 0,
			glass: 0
		},
		networth: 0
	}
	Dailystats.insert(stat)
}