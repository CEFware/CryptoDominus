Template.market_panel.helpers({

	grain: function() {
		return Market.findOne({type: 'grain'}, {fields: {price: 1}})
	},

	lumber: function() {
		return Market.findOne({type: 'lumber'}, {fields: {price: 1}})
	},

	ore: function() {
		return Market.findOne({type: 'ore'}, {fields: {price: 1}})
	},

	wool: function() {
		return Market.findOne({type: 'wool'}, {fields: {price: 1}})
	},

	clay: function() {
		return Market.findOne({type: 'clay'}, {fields: {price: 1}})
	},

	glass: function() {
		return Market.findOne({type: 'glass'}, {fields: {price: 1}})
	},

	tax_precent: function() {
		return s.market.sell_tax * 100
	},

	disabled_buttons: function() {
		if (Session.get('temp_market_type') && Session.get('temp_market_quantity')) {
			var type = Session.get('temp_market_type')
			var quantity = Session.get('temp_market_quantity')
			if (quantity > 0 && type != '') {
				return false
			}
		}
		return true
	},

	disabled_max_buttons: function() {
		if (Session.get('temp_market_type') == '') {
			return true
		} else {
			return false
		}
	},

	// gold_200: function() {
	// 	return round_number(worth_of_army(s.stripe.num_footmen, s.stripe.num_archers, s.stripe.num_pikemen, s.stripe.num_cavalry) * s.stripe.gold_200)
	// },

	// gold_500: function() {
	// 	return round_number(worth_of_army(s.stripe.num_footmen, s.stripe.num_archers, s.stripe.num_pikemen, s.stripe.num_cavalry) * s.stripe.gold_500)
	// },

	// gold_1000: function() {
	// 	return round_number(worth_of_army(s.stripe.num_footmen, s.stripe.num_archers, s.stripe.num_pikemen, s.stripe.num_cavalry) * s.stripe.gold_1000)
	// },

	// gold_2000: function() {
	// 	return round_number(worth_of_army(s.stripe.num_footmen, s.stripe.num_archers, s.stripe.num_pikemen, s.stripe.num_cavalry) * s.stripe.gold_2000)
	// },

	// gold_4000: function() {
	// 	return round_number(worth_of_army(s.stripe.num_footmen, s.stripe.num_archers, s.stripe.num_pikemen, s.stripe.num_cavalry) * s.stripe.gold_4000)
	// },
})


Template.market_panel.events({
	'click #market_buy_button': function(event, template) {
		$('#market_error_alert').hide()
		$('#market_success_alert').hide()

		var type = $('input[name=market_type_radio]:checked').val()
		var quantity = Number($('#quantity_input').val())

		if (type) {
			var resource = Market.findOne({type: type})
			if (resource) {
				if (quantity <= 0) {
					$('#market_error_alert').text('Enter how many you want to buy.')
					$('#market_error_alert').show()
				} else {
					var cost = total_of_buy(type, quantity)
					if (cost <= Meteor.user().gold) {
						$('#market_success_alert').text('Buying resource.')
						$('#market_success_alert').show()

						var button_html = $('#market_buy_button').html()
						$('#market_buy_button').attr('disabled', true)
						$('#market_buy_button').html('Please Wait')

						Meteor.apply('buy_resource', [type, quantity], {wait: true, onResultReceived: function(error, result) {
							if (error) {
								$('#market_error_alert').text('Error')
								$('#market_success_alert').hide()
								$('#market_error_alert').show()
								$('#market_buy_button').attr('disabled', false)
								$('#market_buy_button').html(button_html)
							} else {
								if (result.result) {
									logevent('right_panel', 'complete', 'buy_resources')
									$('#market_success_alert').text('Bought '+quantity+' '+type+' for '+round_number_1(result.cost)+' gold.')
									$('#market_buy_button').attr('disabled', false)
									$('#market_buy_button').html(button_html)
								} else {
									$('#market_error_alert').text(result.reason)
									$('#market_success_alert').hide()
									$('#market_error_alert').show()
									$('#market_buy_button').attr('disabled', false)
									$('#market_buy_button').html(button_html)
								}
							}
						}})
						
					} else {
						$('#market_error_alert').text('You do not have enough gold.')
						$('#market_error_alert').show()
					}
				}
			}
		} else {
			$('#market_error_alert').text('Select which type you want to buy.')
			$('#market_error_alert').show()
		}
	},

	'click #market_sell_button': function(event, template) {
		$('#market_error_alert').hide()
		$('#market_success_alert').hide()

		var type = $('input[name=market_type_radio]:checked').val()
		var quantity = Number($('#quantity_input').val())

		if (type) {
			var resource = Market.findOne({type: type})
			if (resource) {
				if (quantity <= 0) {
					$('#market_error_alert').text('Enter how many you want to sell.')
					$('#market_error_alert').show()
				} else {
					if (Meteor.user()[type] >= quantity) {
						$('#market_success_alert').text('Selling resource.')
						$('#market_success_alert').show()

						var button_html = $('#market_sell_button').html()
						$('#market_sell_button').attr('disabled', true)
						$('#market_sell_button').html('Please Wait')

						Meteor.apply('sell_resource', [type, quantity], {wait: true, onResultReceived: function(error, result) {
							if (error) {
								$('#market_error_alert').text('Error')
								$('#market_success_alert').hide()
								$('#market_error_alert').show()
								$('#market_sell_button').attr('disabled', false)
								$('#market_sell_button').html(button_html)
							} else {
								if (result.result) {
									logevent('right_panel', 'complete', 'sell_resources')
									$('#market_success_alert').text('Sold '+quantity+' '+type+' for '+round_number_1(result.total)+' gold.')
									$('#market_sell_button').attr('disabled', false)
									$('#market_sell_button').html(button_html)
								} else {
									$('#market_error_alert').text('Unable to sell resource.')
									$('#market_success_alert').hide()
									$('#market_error_alert').show()
									$('#market_sell_button').attr('disabled', false)
									$('#market_sell_button').html(button_html)
								}
							}
						}})
					} else {
						$('#market_error_alert').text('You do not have enough '+type+'.')
						$('#market_error_alert').show()
					}
				}
			}
		} else {
			$('#market_error_alert').text('Select which type you want to sell.')
			$('#market_error_alert').show()
		}
	},

	'keyup #quantity_input': function(event, template) {
		var input = $('#quantity_input').val()
		if (isNaN(parseFloat(input))) {
			$('#quantity_input').val( input.replace(/[^0-9\.]/g,'') )
			Session.set('temp_market_quantity', Number($('#quantity_input').val()))
		}
	},

	'input #quantity_input': function(event, template) {
		Session.set('temp_market_quantity', Number($('#quantity_input').val()))
	},

	'change input[name=market_type_radio]': function(event, template) {
		Session.set('temp_market_type', $('input[name=market_type_radio]:checked').val())
	},

	// 'click #stripe_button_200': function(event, template) {
	// 	var button = template.find('#stripe_button_200')
	// 	stripe_checkout(200, template, button)
	// },

	// 'click #stripe_button_500': function(event, template) {
	// 	var button = template.find('#stripe_button_500')
	// 	stripe_checkout(500, template, button)
	// },

	// 'click #stripe_button_1000': function(event, template) {
	// 	var button = template.find('#stripe_button_1000')
	// 	stripe_checkout(1000, template, button)
	// },

	// 'click #stripe_button_2000': function(event, template) {
	// 	var button = template.find('#stripe_button_2000')
	// 	stripe_checkout(2000, template, button)
	// },

	// 'click #stripe_button_4000': function(event, template) {
	// 	var button = template.find('#stripe_button_4000')
	// 	stripe_checkout(4000, template, button)
	// },

	'click #max_sell_button': function(event, template) {
		var num = Meteor.user()[Session.get('temp_market_type')]
		num = Math.floor(num)
		$('#quantity_input').val(num)
		Session.set('temp_market_quantity', num)
	},

	'click #max_buy_button': function(event, template) {
		var type = Session.get('temp_market_type')
		var resource = Market.findOne({type: type})
		if (resource) {
			var num = max_buy(Meteor.user().gold, resource.price)
			$('#quantity_input').val(num)
			Session.set('temp_market_quantity', num)
		}
	}
})


// stripe_checkout = function(amount_in_cents, template, button) {
// 	var error_alert = template.find('#stripe_error_alert')
// 	var success_alert = template.find('#stripe_success_alert')

// 	var amount = worth_of_army(s.stripe.num_footmen, s.stripe.num_archers, s.stripe.num_pikemen, s.stripe.num_cavalry) * s.stripe['gold_'+amount_in_cents]

// 	$(error_alert).hide()
// 	$(success_alert).hide()

// 	var button_html = $(button).html()
// 	$(button).attr('disabled', true)
// 	$(button).html('<i class="fa fa-refresh fa-spin"></i> Please Wait')

// 	var handler = StripeCheckout.configure({
// 		key: s.stripe.publishable_key,
// 		image: '/stripe_logo.jpg',
// 		token: function(token, args) {
// 			// Use the token to create the charge with a server-side script.
// 			// You can access the token ID with `token.id`
// 			$(button).html('<i class="fa fa-refresh fa-spin"></i> Please Wait. Charging card.')
// 			Meteor.call('stripe_buy_gold', amount_in_cents, token, function(error, charge_id) {
// 				if (error) {
// 					$(button).attr('disabled', false)
// 					$(button).html(button_html)
// 					$(error_alert).show()
// 					$(error_alert).html('Error charging card.  Card declined.')
// 				} else {
// 					log_gold_purchase(charge_id, amount_in_cents)

// 					$(button).attr('disabled', false)
// 					$(button).html(button_html)
// 					$(success_alert).show()
// 					$(success_alert).html('Purchased '+round_number_1(amount)+' gold.')
// 				}
// 			})
// 		}
// 	})

// 	handler.open({
// 		name: s.game_name,
// 		description: round_number(amount) +" gold ($"+round_number_1(amount_in_cents/100)+")",
// 		amount: amount_in_cents,
// 		email: Meteor.user().emails[0].address
// 	})
// }



Template.market_panel.destroyed = function() {
	if (this.deps_preview) {
		this.deps_preview.stop()
	}
	if (this.deps_subscribeMarket) {
		this.deps_subscribeMarket.stop()
	}
	if (this.deps_marketCharts) {
		this.deps_marketCharts.stop()
	}
}


Template.market_panel.rendered = function() {
	Session.set('temp_market_type', '')
	Session.set('temp_market_quantity', 0)


	// subscribe
	this.deps_subscribeMarket = Deps.autorun(function() {
		Meteor.subscribe('markethistory')
	})



	this.deps_preview = Deps.autorun(function() {
		$('#market_preview_buy').text('')
		$('#market_preview_sell').text('')
		$('#market_preview_buy').css('color', '#fff')
		$('#market_preview_sell').css('color', '#fff')

		var type = Session.get('temp_market_type')
		var quantity = Session.get('temp_market_quantity')

		if (quantity > 0 && type != '') {
			var resource = Market.findOne({type: type})
			if (resource) {
				// buy
				var cost = total_of_buy(type, quantity)
				$('#market_preview_buy').text('Buy '+quantity+' '+type+' for '+round_number_1(cost)+' gold.')
				if (cost > Meteor.user().gold) {
					$('#market_preview_buy').css('color', 'red')
				}

				if (Meteor.user()[type] < quantity) {
					$('#market_preview_sell').css('color', 'red')
					$('#market_preview_sell').text('Not enough available.')
				} else {
					var total = total_of_sell(type, quantity)
					$('#market_preview_sell').text('Sell '+quantity+' '+type+' for '+round_number_1(total)+' gold.')
				}
			}
		}
	})




	// charts
	this.deps_marketCharts = Deps.autorun(function() {
		if (Session.get('show_market_panel')) {
			var markethistory = Markethistory.find({}, {sort: {created_at: 1}})
			if (markethistory) {

				var i_grain = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.price.grain }
				})
				markethistory.rewind()
				var i_lumber = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.price.lumber }
				})
				markethistory.rewind()
				var i_ore = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.price.ore }
				})
				markethistory.rewind()
				var i_wool = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.price.wool }
				})
				markethistory.rewind()
				var i_clay = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.price.clay }
				})
				markethistory.rewind()
				var i_glass = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.price.glass }
				})

				if (i_grain.length > 0 && i_lumber.length > 0 && i_ore.length > 0 && i_wool.length > 0 && i_clay.length > 0 && i_glass.length > 0) {
					var price_data = [
						{values: i_grain, key: 'Grain', color: '#82d957'},
						{values: i_lumber, key: 'Lumber', color: '#b3823e'},
						{values: i_ore, key: 'Ore', color: '#d9d9d9'},
						{values: i_wool, key: 'Wool', color: '#d9cf82'},
						{values: i_clay, key: 'Clay', color: '#d98659'},
						{values: i_glass, key: 'Glass', color: '#5793d9'},
					]

					nv.addGraph(function() {
						var chart = nv.models.lineChart().useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)

						chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
						chart.yAxis.tickFormat(d3.format(",.2f"))

						d3.select('#market_price_chart svg').datum(price_data).transition().duration(300).call(chart)

						//nv.utils.windowResize(chart.update)

						return chart
					})
				}





				markethistory.rewind()
				var vol = markethistory.map(function(value, index) {
					return {x: value.created_at, y:value.quantity }
				})

				if (i_grain.length > 0 && i_lumber.length > 0 && i_ore.length > 0 && i_wool.length > 0 && i_clay.length > 0 && i_glass.length > 0) {
					var volume_data = [
						{values: vol, key: 'Volume', color: '#5793d9'},
					]

					nv.addGraph(function() {
						var chart = nv.models.lineChart().useInteractiveGuideline(true).showLegend(true).showYAxis(true).showXAxis(true)

						chart.xAxis.tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
						chart.yAxis.tickFormat(d3.format(",.0f"))

						d3.select('#market_volume_chart svg').datum(volume_data).transition().duration(300).call(chart)

						nv.utils.windowResize(chart.update)

						return chart
					})
				}
			}

		}
	})

	logevent('panel', 'open', 'market')
}