var builder = require('botbuilder');
var lib = new builder.Library('general');
var request = require('request');

//create intent recognizer based on LUIS model, way to parse through if user were to send in big file


const luisAppId = process.env.LUIS_MODEL_URL;
const luisAPIKey = process.env.LUIS_APP_ID;
const serviceEndpoint = process.env.LUIS_API_KEY;

// Default is westus
const luisModel = serviceEndpoint + luisAppId + '?subscription-key=' + luisAPIKey;


lib.dialog('/',[
    function(session){
        builder.Prompts.text(session, 'ask_general');
    },
    function(session,args){
        var text  = args.response 
        text = text.replace(/#/g,"")
        print("Here")
        request.get(
        {url:luisModel+text,
        dataType: 'json'},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var data = JSON.parse(body)
                session.send(data);
                session.endDialogWithResult({generalDetails: data});
            }else{
                console.log('Error')
                session.endDialogWithResult({generalDetails: session.conversationData.general});
            }
            });
    }
])

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
}; 

