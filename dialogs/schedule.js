const builder = require('botbuilder');
const lib = new builder.Library('schedule');

lib.dialog('/',[
    function(session){
        session.send('Hilooooo')
    }
]);


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};