import requests
import json

def __auth(self):
""" MicrosoftBotFrameworkのOAuthClient認証を行いaccess_tokenを取得する """

headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
data = {
  'grant_type': 'client_credentials',
  'client_id': '** YOUR CLIENT_ID **',
  'client_secret': '** YOUR CLIENT_SECRET **',
  'scope': 'https://graph.microsoft.com/.default'
}

access_token_response = requests.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', headers = headers, data = data)

if access_token_response.status_code != 200 :
  print access_token_response.headers
print access_token_response.text
raise StandardError('Skype OAuth Failed')

tokens = json.loads(access_token_response.text)
return tokens['access_token']



TARGET_CHAT = '** TARGET CONVERSATION ID **'

def __post(self, token, message):
""" MicrosoftBotFrameworkのチャット投稿用RESTAPIを叩く """

headers = {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}

data = {
  'type': 'message/text',
  'text': message
}

response = requests.post('https://api.skype.net/v3/conversations/' + TARGET_CHAT + '/activities/', headers = headers, json = data)

if response.status_code != 201 :
  print response.status_code
print response.headers
print response.text
raise StandardError('Skype Post Failed')

return