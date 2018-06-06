"use strict";
const builder = require("botbuilder");

// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var inMemoryStorage = new builder.MemoryBotStorage();

var events = []
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

const intents = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(process.env.LUIS_MODEL)
    ]
});

intents.matches('BookEvent', 'BookEvent');
intents.matches('ViewEvents', 'ViewEvents');
intents.matches('None', 'None');

bot.dialog('/', intents);

//Book event found
bot.dialog('BookEvent',[
    function(session){
        session.conversationData = "";
        session.beginDialog('main:/');
    },
    function(session,args){
    	if(session.userData.eventsTitle){
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

//Book event found
bot.dialog('ViewEvents',[
    function(session){
    	if(session.userData.eventsTitle){
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

bot.dialog('None', function (session) {
    session.endDialog('Hi! Welcome to the Schedule-It, I can help you with a variety of requests, try saying something like "Book an event!');
})

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