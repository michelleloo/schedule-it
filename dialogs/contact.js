var builder = require('botbuilder');

var lib = new builder.Library('contact');

// Recipient & Sender details
lib.dialog('/', [
    function (session) {
        session.send('start_info')
        builder.Prompts.text(session, 'ask_first_name');
    },
    function (session, args) {
        session.dialogData.recipientFirstName = args.response;
        builder.Prompts.text(session, 'ask_last_name');
    },
    function (session, args) {
        session.dialogData.recipientLastName = args.response;
        session.beginDialog('validators:phonenumber', {
            prompt: session.gettext('ask_recipient_phone_number'),
            retryPrompt: session.gettext('invalid_phone_number'),
            maxRetries: Number.MAX_VALUE
        });
    },
    function (session, args) {
        session.dialogData.recipientPhoneNumber = args.response;
        session.beginDialog('validators:email', {
            prompt: session.gettext('ask_email'),
            retryPrompt: session.gettext('invalid_email'),
            maxRetries: Number.MAX_VALUE
        });
    },
    function (session, args) {
        var details = {
            sender: {
                firstName: session.dialogData.recipientFirstName,
                lastName: session.dialogData.recipientLastName,
                phoneNumber: session.dialogData.recipientPhoneNumber,
                email: session.dialogData.Email
            },
        };
        session.endDialogWithResult({ details: details });
    }
]);



// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};