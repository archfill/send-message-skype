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
      var target_chat = '19:2031ade936744c32834165865eb4d6ee@thread.skype';
      var serviceUrl = 'https://skype.botframework.com';
      var url = serviceUrl + '/v3/conversations/' + target_chat + '/activities';
      var message = 'test';
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

      // console.log(JSON.stringify(options));

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

      callback(null, req.body);
    },
  ], function (err, send_message) {
    if (err) {
      var errormessage = {
        code : '9999',
        message : "API処理中にエラーが発生しました。"
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