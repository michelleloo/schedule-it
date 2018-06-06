const builder = require('botbuilder');
const lib = new builder.Library('main');
var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

lib.dialog('/',[
    function (session) {
        session.send("Okay %s, Lets get you started on scheduling your event!", session.userData.Name)
        session.beginDialog('date:/')
    },
    function(session,args){
		//Retrive date/time of the event
		session.conversationData.startDate = args.eventDate;
		//call address to get the event
    session.beginDialog('date:/')
    },
    function(session,args){
    //Retrive date/time of the event
    session.conversationData.endDate = args.eventDate;
    //call address to get the event
    session.beginDialog('address:/',
    {promptMessage: session.gettext('default_address_prompt')})
    },
    function(session,args){
        session.conversationData.eventAddress = args.address;
        session.beginDialog('description:/')
    },
    function(session,args){
        session.conversationData.eventDescription = args.descriptionDetails;
        session.beginDialog('company:/')
    },
    function(session,args){
        session.conversationData.companyDetails = args.companyDetails;
        session.beginDialog('contact:/')
    },
    function(session,args){
      session.conversationData.contactDetails = args.contactDetails;
      session.send("Hi %s! Here are the final details of your event and they have been added to your total events!", session.userData.Name)
      var titleDescription = session.conversationData.eventDescription
      var contentDetails = [session.conversationData.startDate,session.conversationData.endDate, session.conversationData.eventAddress,session.conversationData.companyDetails.company,session.conversationData.companyDetails.bring]
      var contentString = "<b>Start Date:</b> %s <br/> <b>End Date:</b> %s<br/> <b>Address of event: </b>%s <br/> <b>Attendees:</b> %s <br/><b>Names of Attendees:</b> %s"
      var endDetails = vsprintf(contentString,contentDetails)

      var eventCard = new builder.HeroCard(session)
      .title(titleDescription)
      .text(endDetails)

      session.send(new builder.Message(session)
        .addAttachment(eventCard));

        var finalDetails = {
            titleDescription: titleDescription,
            textDescription: endDetails
        };
      session.endDialogWithResult({
      finalDetails: finalDetails});
    }

]);
function createCard(session){
    session.send('Here are the details of your event!')
    var eventCard = new builder.HeroCard(session)
    .title(session.conversationData.eventDescription)
    .text('summary', session.conversationData.startDate,session.conversationData.endDate, session.conversationData.eventAddress,session.conversationData.companyDetails.company,session.conversationData.companyDetails.askBring);
    return eventCard

}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
}; 
