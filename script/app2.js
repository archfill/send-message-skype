// app2.js

var restify = require('restify');
var request = require('request');
var async = require('async');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

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
          console.log(JSON.parse(body)['access_token']);
          access_token = JSON.parse(body)['access_token'];
        };
        if (error) {
          console.log('error!');
          console.log(error);
        };
        //次の処理を呼び出す。callbackを呼ばないと次の処理は実行されない
        callback(null, access_token);
      });
    },
    function (access_token, callback) {
      console.log('access_token:' + access_token);
      // MicrosoftBotFrameworkのチャット投稿用RESTAPIを叩く
      var target_chat = '19:26aa87fcb80f43728abdfd129f3e43c2@thread.skype';
      var url = 'https://skype.botframework.com/v3/conversations/' + target_chat + '/activities/';
      var message = 'test';
      var headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
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

      request(options, function (error, response, body) {
        if (body) {
          console.log('succes!');
          console.log(body);
        };
        if (error) {
          console.log('error!');
          console.log(error);
        };
        console.log(JSON.stringify(response));
      });

      callback(null, 'hey!');
    },
  ], function (err, send_message) {
    res.send(send_message);
    return
  });

};

server.post('/api/send_message_skype', sendMessageSkype);