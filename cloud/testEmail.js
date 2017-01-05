
//todo - this doesn't get picked up - why not?  I think I'd need to add it to index.js under the cloud env variable
Parse.Cloud.define('testemail2', function(req, res) {
  var api_key = 'key-f3aa2926c0a4002d220ddfbdbf37edb6';
  var domain = 'sandbox3ecf55c5e2a44480af97f09c7e9c6708.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'DNS-Parse-Server-Test <noreply@dns-parse-server-test.com>',
    to: 'neil.soutar@iag.com.au',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
});