// app2.js

var restify = require('restify');
var request = require('sync-request');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

function sendMessageSkype(req, res, next) {

  // MicrosoftBotFrameworkのOAuthClient認証を行いaccess_tokenを取得する

  var headers = {
    'Content-Type' : 'application/x-www-form-urlencoded'
  };
  var bodys = {
    'grant_type' : 'client_credentials',
    'client_id' : '31df04c5-00e6-4e1e-98a0-e04a7e292e9b',
    'client_secret' : 'YZzoCR9LwicAwSsqAfRjN0N',
    'scope' : 'https://graph.microsoft.com/.default'
  };
  var access_token;
  var response = request(
    'POST',
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      headers: headers,
      body: bodys
    });

  console.log(response);
  console.log(" body");
  console.log(JSON.parse(response.getBody('utf8')));

  res.send('hey!');
  return

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
  });

  console.log('access_token:' + access_token);

  var target_chat = '19:26aa87fcb80f43728abdfd129f3e43c2@thread.skype';
  var url = 'https://api.skype.net/v3/conversations/' + target_chat + '/activities/';

  var message = 'test';

  // MicrosoftBotFrameworkのチャット投稿用RESTAPIを叩く

  var headers = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json'
  };

  var data = {
    'type': 'message/text',
    'text': message
  };

  var options = {
    url: url,
    method: 'POST',
    headers: headers,
    json: {
      'data': data
    }
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

  res.send('hey!');

  return
};
server.post('/api/send_message_skype', sendMessageSkype);