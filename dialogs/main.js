const builder = require('botbuilder');
const lib = new builder.Library('main');

lib.dialog('/',[
    function (session) {
          builder.Prompts.text(session, 'get_started');
    },
    function (session,args) {
      session.conversationData.recipientFirstName = args.response;
      // Ask for date details using 'date' library
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
        //Get the driver details
        session.beginDialog('description:/')
    },
    function(session,args){
        session.conversationData.eventDescription = args.descriptionDetails;
        //Get extract company details
        session.beginDialog('company:/')
    },
    function(session,args){
        session.conversationData.companyDetails = args.companyDetails;
        //Get extract contact details
        session.beginDialog('contact:/')
    },
    function(session,args){
      session.conversationData.contactDetails = args.contactDetails;
      var eventCard = createCard(session)
  session.send(new builder.Message(session)
    .addAttachment(eventCard));
      session.endDialogWithResult({
      eventCard: eventCard});
    }

]);
function createCard(session){
    session.send('Here are the details of your event!')
    var eventCard = new builder.HeroCard(session)
    .title(session.conversationData.eventDescription)
    .text('summary', session.conversationData.startDate,session.conversationData.endDate, session.conversationData.eventAddress,session.conversationData.companyDetails.company,session.conversationData.companyDetails.askBring);
    return eventCard

}
function AboutEvent(session){
    session.send('Here are the details of your event!')
    session.send('about_event', session.conversationData.policyDetails, session.conversationData.dateDetails,session.conversationData.incidentAddress);
    session.send('claim_details',session.conversationData.driverDetails.driver,session.conversationData.driverDetails.injury,session.conversationData.damageDetails);
    session.send('contact_details',session.conversationData.firstname,session.conversationData.contactDetails.lastName,session.conversationData.phoneNumber,session.conversationData.email,session.conversationData.contactDetails.bestTime);
}
//Date, Address, Company, Details, Email, Phone number
function sendEmail(session, userEmail, agentEmail){
    var subjectMessage = createSubject(session)
    var emailMessage = createMessage(session);
    var recipients = [userEmail,agentEmail]
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'thecoop38@gmail.com',
            pass: 'thecoop38__'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Event Bot" <thecoop38@gmail.com>', // sender address
        to: recipients, // list of receivers
        subject: subjectMessage, // Subject line
        //text:  emailMessage, // plain text body
        html: emailMessage // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
function createMessage(session){
    var aboutdetails = [session.conversationData.generalDetails.query,session.conversationData.policyDetails,session.conversationData.dateDetails,session.conversationData.incidentAddress,session.conversationData.driverDetails.driver,session.conversationData.driverDetails.injury,session.conversationData.damageDetails,session.conversationData.firstname,session.conversationData.contactDetails.lastName,session.conversationData.phoneNumber,session.conversationData.email,session.conversationData.contactDetails.bestTime]
    return vsprintf("<b>Describe the incident:</b><br/>%s<br/><b>About the claim:</b> <br/> Policy Number: %s <br/> Time of the Incident: %s <br/> Location of the Incident: %s <br/> <b>Claim Details:</b>  <br/> Person driving where accident occured: %s <br/> Injuries Involved: %s <br/> Damage to the vehicle: %s <br/> <b>Contact Details:</b> <br/> Name: %s %s <br/> Phone number: %s <br/> Email: %s <br/> Best time to contact: %s ", aboutdetails);
}


function createSubject(session){
    var c = [session.conversationData.firstname]
    return vsprintf("Hi %s! Here are the details of your event", c);
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
}; 
