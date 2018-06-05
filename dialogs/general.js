var builder = require('botbuilder');
var lib = new builder.Library('general');
var request = require('request');

//create intent recognizer based on LUIS model
//var luisModel = "";

const luisAppId = '4e100b7d-8cc1-4fe6-b645-af2be8664089';
const luisAPIKey = '0f08553c4d114066aad27bb448da285d';
const serviceEndpoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';

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

