Template.chatrooms_panel.helpers({
	chatroomSubscriptionReady: function() {
		return Session.get('chatroomSubscriptionReady')
	},

	normalChatrooms: function() {
		return Rooms.find({type:'normal'})
	}
})


Template.chatrooms_panel.events({
	'click #chat_start_with_button': function(event, template) {
		var name = template.find('#chat_start_with_name')
		var error_alert = template.find('#chat_error_alert')
		var success_alert = template.find('#chat_success_alert')

		var error = false
		$(error_alert).hide()
		$(success_alert).hide()

		if ($(name).val().length == 0) {
			error = true
			$(error_alert).show()
			$(error_alert).html("Enter someone's name then click the button.")
		}

		if (!error) {
			var button_html = $('#chat_start_with_button').html()
			$('#chat_start_with_button').attr('disabled', true)
			$('#chat_start_with_button').html('Please Wait')

			Meteor.call('startChatroomWith', $(name).val(), function(error, result) {
				$('#chat_start_with_button').attr('disabled', false)
				$('#chat_start_with_button').html(button_html)

				if (error) {
					$(error_alert).show()
					$(error_alert).html(error.error)
				} else {
					if (result) {
						$(success_alert).show()
						$(success_alert).html("Chatroom created.")
					} else {
						$(error_alert).show()
						$(error_alert).html("Could not find a user by that name.")
					}
				}
			})
		}
	}
})



Template.chatrooms_panel.rendered = function() {
	Session.set('chatroomSubscriptionReady', false)

	this.autorun(function() {
		var normalChatroomsHandle = Meteor.subscribe('myNormalChatrooms')
		Session.set('chatroomSubscriptionReady', normalChatroomsHandle.ready())
	})
}