// app.js

var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// function messageRespond(req, res, next) {
//     res.send('hey!');
// };

function sendMessageSkype(req, res, next) {
    res.send('hey!');
};
server.post('/api/send_message_skype', sendMessageSkype);


//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

//複数の条件を指定する場合はmatchesAnyに配列で渡す
//正規表現で .*hoge.* は「hogeが入っているなら」にマッチする
// 「/  /i」  正規表現のiフラグは大文字小文字を区別しないようにできる
// http://kyu-mu.net/coffeescript/regexp/
intents.matchesAny([/.*hi.*/i,/.*hello.*/i,/.*こんにちは.*/i],function(session){
  session.send('こんにちは');
});

// 1つの条件でいい場合はmatches
// 複数チェインすることも可能
intents.matches(/.*しよ.*/i,function(session){
  session.send('いいよ');
}).matches(/.*して？.*/i,function(session){
  session.send('やだよぉ');
});

// どの条件にもマッチしない場合はonDefault
intents.onDefault(function(session){
  session.send("＊＊＊しよう");
});

// bot.dialog('/', function (session) {
//     session.send('Hello World');
// });