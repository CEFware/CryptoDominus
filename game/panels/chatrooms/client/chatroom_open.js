Template.chatroom_open.helpers({
	chatroomChatsReady: function() {
		return Template.instance().chatroomChatsReady.get()
	},

	membersReady: function() {
		return Template.instance().chatroomMembersReady.get()
	},

	numPeople: function() {
		return this.members.length
	},

	showLeaveConfirm: function() {
		return Template.instance().showLeaveConfirm.get() ? 'block' : 'none'
	},

	showInviteBox: function() {
		return Template.instance().showInviteBox.get() ? 'block' : 'none'
	},

	showRenameBox: function() {
		return Template.instance().showRenameBox.get() ? 'block' : 'none'
	},

	showChatBox: function() {
		return Template.instance().showChatBox.get() ? 'block' : 'none'
	},

	roomChats: function() {
		var room_id = Session.get('selectedChatroomId')
		var chats = Roomchats.find({room_id:room_id}, {sort: {created_at: -1}})
		return chats.map(function(chat) {
			var user = RoomMembers.findOne(chat.user_id)
			if (user) {
				chat.username = user.username
				chat.castle_id = user.castle_id
				chat.x = user.x
				chat.y = user.y
			}
			return chat
		})
	},

	roomMembers: function() {
		return RoomMembers.find()
	},

	showMembers: function() {
		return Template.instance().showMembers.get()
	}
})


Template.chatroom_open.events({
	'click .leaveChatroomButton': function(event, template) {
		if (template.showLeaveConfirm.get()) {
			template.showLeaveConfirm.set(false)
			template.showChatBox.set(true)
		} else {
			template.showChatBox.set(false)
			template.showRenameBox.set(false)
			template.showInviteBox.set(false)
			template.showLeaveConfirm.set(true)
		}
	},

	'click .chatroomLeaveNoButton': function(event, template) {
		template.showLeaveConfirm.set(false)
		template.showChatBox.set(true)
	},

	'click .chatroomLeaveYesButton': function(event, template) {
		Meteor.call('leaveChatroom', template.data._id)
	},

	'click .showMembersButton': function(event, template) {
		template.showMembers.set(!template.showMembers.get())
	},

	'click .renameButton': function(event, template) {
		if (template.showRenameBox.get()) {
			template.showRenameBox.set(false)
			template.showChatBox.set(true)
		} else {
			template.showChatBox.set(false)
			template.showLeaveConfirm.set(false)
			template.showInviteBox.set(false)
			template.showRenameBox.set(true)
		}
	},

	'click .renameCancelButton': function(event, template) {
		template.showRenameBox.set(false)
		template.showChatBox.set(true)
	},

	'click .renameSaveButton': function(event, template) {
		var name = template.find('.renameInput')
		var errorAlert = template.find('.renameErrorAlert')
		var button = event.currentTarget
		var button_html = $(button).html()

		$(errorAlert).hide()

		$(button).attr('disabled', true)
		$(button).html('Please Wait')

		Meteor.call('renameChatroom', template.data._id, $(name).val(), function(error, result) {
			$(button).attr('disabled', false)
			$(button).html(button_html)

			if (error) {
				$(errorAlert).show()
				$(errorAlert).html(error.error)
			} else {
				template.showRenameBox.set(false)
				template.showChatBox.set(true)
			}
		})
	},

	'click .inviteButton': function(event, template) {
		if (template.showInviteBox.get()) {
			template.showInviteBox.set(false)
			template.showChatBox.set(true)
		} else {
			template.showChatBox.set(false)
			template.showLeaveConfirm.set(false)
			template.showRenameBox.set(false)
			template.showInviteBox.set(true)
		}
	},

	'click .inviteCancelButton': function(event, template) {
		template.showInviteBox.set(false)
		template.showChatBox.set(true)
	},

	'click .inviteSaveButton': function(event, template) {
		var name = template.find('.inviteInput')
		var errorAlert = template.find('.inviteErrorAlert')
		var button = event.currentTarget
		var button_html = $(button).html()

		$(errorAlert).hide()

		$(button).attr('disabled', true)
		$(button).html('Please Wait')

		Meteor.call('inviteToChatroom', template.data._id, $(name).val(), function(error, result) {
			$(button).attr('disabled', false)
			$(button).html(button_html)

			if (error) {
				$(errorAlert).show()
				$(errorAlert).html(error.error)
			} else {
				$(name).val('')
				template.showInviteBox.set(false)
				template.showChatBox.set(true)
			}
		})
	},

	'click .sendChatButton': function(event, template) {
		event.preventDefault()
		event.stopPropagation()

		var input = template.find('.chatInput')

		var message = _.clean($(input).val())

		if (message.length == 0) {
			return
		}

		var date = new Date(TimeSync.serverTime())

		Roomchats.insert({
			room_id: template.data._id,
			created_at: date,
			user_id: Meteor.userId(),
			text: message
		})

		$(input).val('')
	},

	'click .usernameLink': function(event, template) {
		event.preventDefault()
		event.stopPropagation()
		center_on_hex(this.x, this.y)
		Session.set('selected_type', 'castle')
		Session.set('selected_id', this.castle_id)
	}
})



Template.chatroom_open.created = function() {
	var self = this

	this.showLeaveConfirm = new ReactiveVar(false)
	this.showRenameBox = new ReactiveVar(false)
	this.showInviteBox = new ReactiveVar(false)
	this.showMembers = new ReactiveVar(false)
	this.showChatBox = new ReactiveVar(true)

	self.chatroomChatsReady = new ReactiveVar(false)
	this.autorun(function() {
		var selected_id = Session.get('selectedChatroomId')
		if (selected_id) {
			var chatroomChatsHandle = Meteor.subscribe('roomchats', selected_id)
			self.chatroomChatsReady.set(chatroomChatsHandle.ready())
		}
	})

	self.chatroomMembersReady = new ReactiveVar(false)
	this.autorun(function() {
		var roomMembersHandle = Meteor.subscribe('room_members', Template.instance().data.members)
		self.chatroomMembersReady.set(roomMembersHandle.ready())
	})
}