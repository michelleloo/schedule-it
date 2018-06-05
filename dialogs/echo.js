/* ----------------------------------------------------------------------------------
*   Echo Dialog
*   Sample dialog to use as a starting spot for creating bots
*   Or for creating a demo bot 
---------------------------------------------------------------------------------- */

const builder = require('botbuilder');



module.exports = {
    id: 'echo',
    name: 'echo',
    waterfall: [
        (session, args, next) => {
            const botName = 'schedule-it';
            const description = `Book Appointments`;
            session.send(`Hi there! I'm ${botName}`);
            session.send(`In a nutshell, here's what I can do:\n\n${description}`);
            builder.Prompts.text(session, `What's your name?`);
        },
        (session, results, next) => {
            session.beginDialog('main:/')
            session.endConversation(`Welcome, ${results.response}`);
        },
    ]
};