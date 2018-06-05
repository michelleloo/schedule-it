const builder = require('botbuilder');
const lib = new builder.Library('main');

lib.dialog('/',[
    function (session) {
        session.send('get_started')
        // Ask for date details using 'general' library
        session.beginDialog('date:/');
    },
    function(session,args){
		//Retrive date/time of the incident
		session.dialogData.dateDetails = args.eventDate;
		//call address to get the incident
		session.send(session.dialogData.dateDetails)
		session.beginDialog('address:/',
		{promptMessage: session.gettext('default_address_prompt')});
    },
    function(session,args){
        session.dialogData.eventAddress = args.address;
        //Get the driver details
        session.beginDialog('company:/')
    },
    function(session,args){
        session.dialogData.companyDetails = args.companyDetails;

        //Get extract contact details
        session.beginDialog('contact:/')
    }

]);

//Date, Address, Company, Details, Email, Phone number
// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
}; 
