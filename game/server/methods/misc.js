Meteor.methods({	

	generate_hexes: function(num_of_rings) {
		if (Meteor.user().admin) {
			generate_hexes(num_of_rings)
		}
	},

	
})


generate_hexes = function(num_of_rings) {
	delete_all_hexes()
	destroy_all_castles()
	destroy_all_armies()
	destroy_all_villages()

	var hexArray = Hx.createHexGrid(num_of_rings)

	_.each(hexArray, function(h) {
		var hex = assign_properties_to_hex()
		hex.x = h.x
		hex.y = h.y
		hex.is_border = false	// used in creating castle to make sure castle is not on edge of map
		Hexes.insert(hex)
	})
}

// should move to danimal:Hx
add_ring = function(is_border) {
	var h = Hexes.findOne({}, {sort: {x: 1, y: -1}})
	var k = h.y + 1

	var pos = Hx.getNeighbor(h.x, h.y, 4)
	for (var i =  0; i < 6; i++) {
		for (var j = 0; j < k; j++) {
			var hex = assign_properties_to_hex()
			hex.x = pos.x
			hex.y = pos.y
			hex.is_border = is_border	// keep track of hexes on the edge of map so that people don't get castles on the edge
			var id = Hexes.insert(hex)
			// move to neighbor in direction i
			pos = Hx.getNeighbor(pos.x, pos.y, i)
		}
	}

	Minimap.update_map_size_setting()
}




delete_all_hexes = function() {
	Hexes.remove({})
}





function assign_properties_to_hex() {
	var r = Random.fraction()
	
	var hex = {}

	hex.has_building = false,
	hex.nearby_buildings = false

	if (r >= s.gen.grain_min && r <= s.gen.grain_max) {
		hex.type = 'grain'
	}
	if (r > s.gen.lumber_min && r <= s.gen.lumber_max) {
		hex.type = 'lumber'
	}
	if (r > s.gen.ore_min && r <= s.gen.ore_max) {
		hex.type = 'ore'
	}
	if (r > s.gen.clay_min && r <= s.gen.clay_max) {
		hex.type = 'clay'
	}
	if (r > s.gen.glass_min && r <= s.gen.glass_max) {
		hex.type = 'glass'
	}
	if (r > s.gen.wool_min && r <= s.gen.wool_max) {
		hex.type = 'wool'
	}

	// pick a random number for which image to use
	 var rand = Math.floor(Math.random() * s.resource.numTileImages[hex.type]) + 1
	 rand = _.lpad(rand, 2, '0')
	 hex.tileImage = rand 

	return hex
}