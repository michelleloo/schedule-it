"use strict";
const builder = require("botbuilder");


//Initialize the statestorage for the bot. 
//For production can use Azure Table, CosmosDb, SQL Azure or could implement own database 
var inMemoryStorage = new builder.MemoryBotStorage();

// Create chat bot
var connector = new builder.ChatConnector({
   appId: null,
   appPassword: null
});
var bot = new builder.UniversalBot(connector);


// Set default locale
bot.set('localizerSettings', {
    botLocalePath: './locale',
    defaultLocale: 'en'
});

//Initialize LUIS setup for NLP
const intents = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(process.env.LUIS_MODEL)
    ]
});

intents.matches('BookEvent', 'BookEvent');
intents.matches('ViewEvents', 'ViewEvents');
intents.matches('DeleteData', 'DeleteData');
intents.matches('None', 'None');
bot.dialog('/', intents);

//Book event intent found
bot.dialog('BookEvent',[
    function(session){
        session.conversationData = "";
        session.beginDialog('main:/');
    },
    function(session,args){
    	if(session.userData.eventsTitle.length != undefined){
    		session.userData.eventsTitle.push(args.finalDetails.titleDescription)
    		session.userData.eventDetail.push(args.finalDetails.textDescription)    	}
    	else{
    		session.userData.eventsTitle = []
    		session.userData.eventDetail = []
    		session.userData.eventsTitle.push(args.finalDetails.titleDescription)
    		session.userData.eventDetail.push(args.finalDetails.textDescription)
    	}
    	session.endDialog();

    }
]).triggerAction({
    matches: 'BookEvent',
    onInterrupted: function (session) {
        session.send('Hi! Welcome to Schedule it!');
    }
});

//View events found
bot.dialog('ViewEvents',[
    function(session){
    	if(session.userData.eventsTitle.length >= 1){
    		session.send("Here are your current events!")
    		var attachments = [];
			var msg = new builder.Message(session);
			msg.attachmentLayout(builder.AttachmentLayout.carousel)
			var i;
			for (i = 0; i < session.userData.eventsTitle.length; i++) { 
			    var card = new builder.HeroCard(session)
                    .title(session.userData.eventsTitle[i])
                    .text(session.userData.eventDetail[i])
            attachments.push(card); 

			}
			msg.attachments(attachments);
			session.send(msg)
    	}
    	else{
    		session.send("Looks like you don't have any events planned!")
    	}
    	session.endDialog();

    }
]).triggerAction({
    matches: 'ViewEvents',
    onInterrupted: function (session) {
        session.send('Hi! Welcome to Schedule it!');
    }
});

//User wants to delete data
bot.dialog('DeleteData',[
    function(session){
        builder.Prompts.choice(session, 'Would you like to delete all the saved events?',"Yes|No",{listStyle: builder.ListStyle.button});
    },
    function (session, args) {
		var selection = args.response.entity;
		switch(selection){
			case "Yes":
			    session.userData.eventsTitle = []
    			session.userData.eventDetail = []
				session.send("All events have been deleted!")
				break;
			case "No":
				session.send("Okay! Nothing was deleted, go book more events!")
				break;
			default:
				session.send("Okay! Nothing was deleted, go book more events!")
				break;
		}
		session.endDialog();
	
    }
]).triggerAction({
    matches: 'DeleteData',
    onInterrupted: function (session) {
        session.send('Hi! Welcome to Schedule it!');
    }
});

//No intent is found
bot.dialog('None', [function (session) {
	if(session.userData.Name){
		session.endDialog('Hi %s! Welcome to the Schedule-It, I can help you with a variety of requests, try saying something like "Book an event!',session.userData.Name);
	}
	else{
		builder.Prompts.text(session, "Hi! Welcome to Schedule-It! What's your name?");
	}
},
    function (session,args) {
      session.userData.Name = args.response;
      // Ask for date details using 'date' library
		session.endDialog('Hi %s! I can help you with a variety of requests, try saying something like "Book an event!', session.userData.Name);
    },])

// Sub-Dialogs
bot.library(require('./dialogs/main').createLibrary());
bot.library(require('./dialogs/general').createLibrary());
bot.library(require('./dialogs/date').createLibrary());
bot.library(require('./dialogs/address').createLibrary());
bot.library(require('./dialogs/company').createLibrary());
bot.library(require('./dialogs/description').createLibrary());
bot.library(require('./dialogs/contact').createLibrary());


// Validators
bot.library(require('./validators').createLibrary());


module.exports = bot;