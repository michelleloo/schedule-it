var builder = require('botbuilder');
var chrono = require('chrono-node');
var lib = new builder.Library('date');


var morningHours = ['6','7','8','9','10','11'];
var afternoonHours = ['1','2','3','4','5'];
var eveningHours = ['5','6','7','8','9','10'];


lib.dialog('/', [
    function (session) {
      if(session.conversationData.startDate){
        builder.Prompts.time(session, 'ask_end_date');
      }
      else{
        builder.Prompts.time(session, 'ask_date');
      }
    },
    function (session, args) {
        if (args.response) {
            session.dialogData.date = builder.EntityRecognizer.resolveTime([args.response]);
            var d = session.dialogData.date
            session.dialogData.dateString = d.toDateString();
            var userHours = formatHours(d);
            switch (userHours){
                case "0":
                  if(session.conversationData.startDate){
                    builder.Prompts.time(session, 'ask_end_time');
                  }
                  else{
                    builder.Prompts.time(session, 'ask_time')};
                break;
                case "6":
                  builder.Prompts.time(session, 'ask_morning');
                  break;
                case "12":
                  if(session.conversationData.startDate){
                    builder.Prompts.time(session, 'ask_end_time');
                  }
                  else{
                    builder.Prompts.time(session, 'ask_time')};                  
                  break;
                case  "15":
                  builder.Prompts.time(session,'ask_afternoon'); 
                  break;
                case  "18": 
                  builder.Prompts.time(session,'ask_evening');
                  break;
                default:
                    var time = formatAMPM(d);
                    session.dialogData.timeString = time;
                    session.send("The event will occur on %s?", session.dialogData.dateString + " at "+ session.dialogData.timeString);
                    builder.Prompts.confirm(session, "Is this the correct date and time?");
                  break;
              }      
    }   else {
            session.endDialogWithResult({
                resumed: builder.ResumeReason.notCompleted
            });
    }
},
function(session,args){
  if(args.response == true){
      var eventDate = session.dialogData.dateString + " "+  session.dialogData.timeString;
      session.send("Great! Let's proceed")
      session.endDialogWithResult({
      eventDate: eventDate});
  }
  else if(args.response == false){
    session.replaceDialog('date:/');
  }
  else{
    session.dialogData.time = builder.EntityRecognizer.resolveTime([args.response]);
    var t = session.dialogData.time;
    var d = session.dialogData.date;
    session.dialogData.timeString = formatAMPM(t);
    if(session.conversationData.startDate){
    session.send("The event will end on %s?", session.dialogData.dateString + " at "+ session.dialogData.timeString);
    }
    else{
    session.send("The event will start on %s?", session.dialogData.dateString + " at "+ session.dialogData.timeString);}
    builder.Prompts.confirm(session, "Is this the correct date and time?");
  }
},
function(session,args) {
  if(args.response == true){
      var eventDate = session.dialogData.dateString + " "+  session.dialogData.timeString;
    //  var eventDate = session.dialogData.date;
      session.send("Great! Let's proceed")
      session.endDialogWithResult({
      eventDate: eventDate});
  }
  else{
    session.replaceDialog('date:/');
  }
}
]);

// Helpers

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


function formatHours(date){
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if(minutes == 0 ){
    return hours + "";
  }
  else{
    return null;
  }
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
}; 