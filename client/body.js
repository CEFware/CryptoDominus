UI.registerHelper('date_calendar', function(jsDate) {
	Session.get('refresh_time_field')
	return moment(new Date(jsDate)).calendar()
})

UI.registerHelper('date_month_day_year', function(jsDate) {
	return moment(new Date(jsDate)).format('M/D/YY')
})


UI.registerHelper('coord_to_pixel_x', function(x, y, offset) {
	check(x, Number)
	check(y, Number)
	check(offset, Number)

	var grid = Hx.coordinatesToPos(x, y, s.hex_size, s.hex_squish)
	//return Math.round(pixel.x +  canvas_center_x + offset)
	return grid.x +  offset
})

UI.registerHelper('coord_to_pixel_y', function(x, y, offset) {
	check(x, Number)
	check(y, Number)
	check(offset, Number)
	
	var grid = Hx.coordinatesToPos(x, y, s.hex_size, s.hex_squish)
	//return Math.round(pixel.y +  canvas_center_y + offset)
	return grid.y +  offset
})

UI.registerHelper('s.hex_size', function() { return s.hex_size })
UI.registerHelper('canvas_width', function() { return Session.get('canvas_size').width }),
UI.registerHelper('canvas_height', function() { return Session.get('canvas_size').height }),
UI.registerHelper('half_canvas_width', function() { return Session.get('canvas_size').half_width }),
UI.registerHelper('half_canvas_height', function() { return Session.get('canvas_size').half_height }),
UI.registerHelper('show_debug_symbols', function() { return Session.get('show_debug_symbols') }),
UI.registerHelper('grid_x', function() { return Session.get('hexes_pos').x }),
UI.registerHelper('grid_y', function() { return Session.get('hexes_pos').y }),
UI.registerHelper('negative_grid_x', function() { return Session.get('hexes_pos').x * -1 }),	// used for fog
UI.registerHelper('negative_grid_y', function() { return Session.get('hexes_pos').y * -1 }),

UI.registerHelper('random_int_1_to_3', function() {
	return Math.floor(Random.fraction() * 3) + 1
})

// draw the outline for the hex
UI.registerHelper('hex_points', function(x, y) {
	var grid = Hx.coordinatesToPos(x, y, s.hex_size, s.hex_squish)
	return calculate_hex_polygon_points(grid.x, grid.y, s.hex_size)
})

UI.registerHelper('round', function(num) {
	if (isNaN(num)) {
		return '-'
	} else {
		return round_number(num)
	}
})

UI.registerHelper('round_1', function(num) {
	if (isNaN(num)) {
		return '-'
	} else {
		return round_number_1(num)
	}
})

UI.registerHelper('round_2', function(num) {
	if (isNaN(num)) {
		return '-'
	} else {
		return round_number_2(num)
	}
})

UI.registerHelper('game_name', function() {
	return s.game_name
})

UI.registerHelper('vassal_tax', function() {
	return s.vassal_tax * 100
})

UI.registerHelper('castle_defense_bonus', function() {
	return s.castle.defense_bonus
})

UI.registerHelper('village_defense_bonus', function() {
	return s.village.defense_bonus
})

UI.registerHelper('ally_castle_defense_bonus', function() {
	return s.castle.ally_defense_bonus
})

// UI.registerHelper('stripe', function() {
// 	return s.stripe
// })

UI.registerHelper('resource_interval', function() {
	return moment.duration(s.resource.interval).humanize()
})

UI.registerHelper('army_settings', function() {
	return s.army
})

UI.registerHelper('resource_settings', function() {
	return s.resource
})

UI.registerHelper('down_for_maintenance', function() {
	return s.down_for_maintenance
})

UI.registerHelper('capitalize', function(words) {
	return _.capitalize(words)
})