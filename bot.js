"use strict";
const builder = require("botbuilder");

// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var inMemoryStorage = new builder.MemoryBotStorage();


// Create chat bot
var connector = new builder.ChatConnector({
   appId: null,
   appPassword: null
});

var bot = new builder.UniversalBot(connector, function (session) {
    session.beginDialog('main:/');
});
// Set default locale
bot.set('localizerSettings', {
    botLocalePath: './locale',
    defaultLocale: 'en'
});

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