

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('testemail', function(req, res) {
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
  // res.success('Hi');
});

Parse.Cloud.define('testemailtemplate', function(req, res) {
// Get access to Parse Server's cache
  const { AppCache } = require('parse-server/lib/cache');
// Get a reference to the MailgunAdapter
// NOTE: It's best to do this inside the Parse.Cloud.define(...) method body and not at the top of your file with your other imports. This gives Parse Server time to boot, setup cloud code and the email adapter.
  const MailgunAdapter = AppCache.get('myAppId')['userController']['adapter'];

// Invoke the send method with an options object
  MailgunAdapter.send({
    templateName: 'testTemplate',
    // Optional override of your configuration's subject
    subject: 'Important: action required',
    // Optional override of the adapter's fromAddress
    fromAddress: 'Parse Server Test <noreply@dns-parse-server-test.com>',
    recipient: 'neil.soutar@iag.com.au',
    variables: { username: 'neil', appName: 'myApp' } // {{alert}} will be compiled to 'New posts'
  });

  res.success('Email sent - maybe');
});

