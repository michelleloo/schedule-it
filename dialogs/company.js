var builder = require('botbuilder');
var lib = new builder.Library('company');

var list_company  = ["Myself","Friend","Parents","Other","Work Meeting"]
lib.dialog('/',[
    function(session) {
        builder.Prompts.choice(session, 'ask_who', list_company,{listStyle: builder.ListStyle.auto});
    },
    function(session,args){
        if(args.response.entity == "Myself"){
            session.dialogData.company = "Myself";
            var companyDetails = {
                company: session.dialogData.company,
                bring: session.userData.Name
            };
            session.endDialogWithResult({companyDetails: companyDetails});
        }
        else{
            session.dialogData.company = args.response.entity;
            builder.Prompts.text(session, 'ask_names');
        }
    },
    function(session,args){
        session.dialogData.askBring = args.response;
        var companyDetails = {
            company: session.dialogData.company,
            bring: session.dialogData.askBring
        };
        session.endDialogWithResult({companyDetails: companyDetails});
    }
])

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};