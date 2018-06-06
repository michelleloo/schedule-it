var builder = require('botbuilder');
var locationDialog = require('botbuilder-location');

var lib = new builder.Library('address');

// Register BotBuilder-Location dialog
lib.library(locationDialog.createLibrary(process.env.BING_MAPS_KEY));

// Main request address dialog, invokes BotBuilder-Location
lib.dialog('/', [
   function (session, args) {
        // Ask for address
        args = args || {};
        var promptMessage = args.promptMessage;
        session.dialogData.promptMessage = promptMessage;

        // Use botbuilder-location dialog for address request
        var options = {
            prompt: promptMessage,
            useNativeControl: true,
            reverseGeocode: true,
            skipConfirmationAsk: true,
            requiredFields:
                locationDialog.LocationRequiredFields.streetAddress |
                locationDialog.LocationRequiredFields.country
        };

        locationDialog.getLocation(session, options);
    },
    function (session, results) {
        if (results.response) {
            // Return selected address to previous dialog in stack
            var place = results.response;
            var address = place.streetAddress + ", " + place.locality + ", " + place.region + ", " + place.country + " (" + place.postalCode + ")"
            session.endDialogWithResult({
                address: address
            });
        } else {
            // No address resolved, restart
            session.replaceDialog('/', { promptMessage: session.dialogData.promptMessage });
        }
    }]);

function createAddressCard(session, buttonTitle, address) {
    return new builder.HeroCard(session)
        .title(buttonTitle)
        .subtitle(address)
        .buttons([
            builder.CardAction.imBack(session, buttonTitle, buttonTitle)
        ]);
}


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};