var builder = require('botbuilder');
// 4120000800
var PhoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);
var EmailRegex = new RegExp(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

var lib = new builder.Library('validators');


lib.dialog('bestTime',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, function (response) {
        return response;
    }));

lib.dialog('phonenumber',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, function (response) {
        return PhoneRegex.test(response);
    }));

lib.dialog('email',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, function (response) {
        return EmailRegex.test(response);
    }));



// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports.PhoneRegex = PhoneRegex;
module.exports.EmailRegex = EmailRegex;