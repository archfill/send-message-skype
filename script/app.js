// app.js

var restify = require('restify');
var request = require('request');
var async = require('async');
var builder = require('botbuilder');

var server = restify.createServer();
server.use(restify.plugins.bodyParser({
  mapParams: true
}));
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

//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

//複数の条件を指定する場合はmatchesAnyに配列で渡す
//正規表現で .*hoge.* は「hogeが入っているなら」にマッチする
// 「/  /i」  正規表現のiフラグは大文字小文字を区別しないようにできる
// http://kyu-mu.net/coffeescript/regexp/
intents.matchesAny([/.*hi.*/i, /.*hello.*/i, /.*こんにちは.*/i], function (session) {
  session.send('こんにちは');
});

// 1つの条件でいい場合はmatches
// 複数チェインすることも可能
intents.matches(/.*hey.*/i, function (session) {
  session.send('hey!');
}).matches(/.*morning.*/i, function (session) {
  session.send('morning');
});

// どの条件にもマッチしない場合はonDefault
intents.onDefault(function (session) {
  session.send("未定義です。");
});

//=========================================================
// API
//=========================================================

function sendMessageSkype(req, res, next) {

  // MicrosoftBotFrameworkのOAuthClient認証を行いaccess_tokenを取得する

  var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  var options = {
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    method: 'POST',
    headers: headers,
    form: {
      'grant_type': 'client_credentials',
      'client_id': '31df04c5-00e6-4e1e-98a0-e04a7e292e9b',
      'client_secret': 'YZzoCR9LwicAwSsqAfRjN0N',
      'scope': 'https://graph.microsoft.com/.default'
    }
  };

  async.waterfall([
    function (callback) {
      var access_token;
      request(options, function (error, response, body) {
        if (body) {
          console.log('succes!');
          console.log(body);
          access_token = JSON.parse(body)['access_token'];
        };
        if (error) {
          console.log('error!');
          console.log(error);
        };
        console.log(JSON.stringify(response));
        //次の処理を呼び出す。callbackを呼ばないと次の処理は実行されない
        callback(null, access_token);
      });
    },
    function (access_token, callback) {
      console.log('access_token:' + access_token);
      // MicrosoftBotFrameworkのチャット投稿用RESTAPIを叩く
      var target_chat = req.params.group_chat_id;
      var serviceUrl = 'https://skype.botframework.com';
      var url = serviceUrl + '/v3/conversations/' + target_chat + '/activities';
      var message = req.params.message;
      var headers = {
        'Authorization': 'Bearer ' + access_token
      };
      var data = {
        'type': 'message',
        'text': message
      };
      var options = {
        url: url,
        method: 'POST',
        headers: headers,
        json: data
      };

      var result;

      request(options, function (error, response, body) {
        if (body) {
          console.log('response.statusCode:' + response.statusCode);
          if (201 === response.statusCode) {
            result = {
              "code": 201,
              "message" : "正常終了しました。"
            }
          } else {
            result = {
              "code": 409,
              "message": "API処理中にエラーが発生しました。",
              "errorResponse" : response
            }
          }
          console.log('send skype:');
          console.log(body);
        };
        if (error) {
          console.log('error!');
          console.log(error);
        };
        console.log(JSON.stringify(response));

        callback(null, result);
      });
    },
  ], function (err, send_message) {
    if (err) {
      var errormessage = {
        "code": 409,
        "message" : "API処理中にエラーが発生しました。"
      };
      res.send(errormessage);
      console.log(err);
      return
    }
    res.send(send_message);
    return
  });

};

server.post('/api/send_message_skype', sendMessageSkype);