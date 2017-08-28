// app2.js

var restify = require('restify');
var request = require('request');

require('date-utils');
var date = new Date();
var dateString = date.toFormat("YYYY-MM-DD HH24:MI:SS");

var url = 'https://fcm.googleapis.com/fcm/send';
var serverkey = 'AIzaSyZ-1u...0GBYzPu7Udno5aA';
var token = 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...';

// data payload
var data = {
  message: 'Hello!',
  date: dateString
};

// HTTP header
var headers = {
  'Content-Type': 'application/json',
  'Authorization': 'key=' + serverkey
};

// request options
var options = {
  url: url,
  method: 'POST',
  headers: headers,
  json: {
    'to': token,
    'data': data
  }
};

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

function auth(){
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

  request(options, function (error, response, body) {
    if (body) {
      console.log('succes');
      console.log(body);
    }
    if (error) {
      console.log('error');
      console.log(error);
    }
    console.log(response);
  });

  //access_token_response = requests.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', headers = headers, data = data)

  // if (access_token_response.status_code != 200) {
  //   console.log(access_token_response.headers);
  //   console.log(access_token_response.text);
  //   console.log('Skype OAuth Failed');
  //   return
  // };

  //tokens = json.loads(access_token_response.text)
  //return tokens['access_token']
};

function sendMessageSkype(req, res, next) {
  auth();
  // res.send('hey!');
  request(options, function (error, response, body) {
    if (body) {
      console.log(body);
    }
    if (error) {
      console.log(error);
    }
  });
};
server.post('/api/send_message_skype', sendMessageSkype);