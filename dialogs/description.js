var builder = require('botbuilder');

var lib = new builder.Library('description');

lib.dialog('/',[
    function(session){
        builder.Prompts.text(session, 'ask_description');
    },
    function(session,args){ 
        session.conversationData.description = args.response;
        session.send('replay_description');
        session.send(session.conversationData.description);
        builder.Prompts.confirm(session,'confirm_description');    
    },
    function(session,args){
        if(args.response==true){
            var details = session.conversationData.description;
            session.send("Thanks! Let's keep going")
            session.endDialogWithResult({
                descriptionDetails: details});
        }
        else{
            session.replaceDialog('description:/');
        }
    }
])
// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
}; 