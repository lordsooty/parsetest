// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var ParseDashboard = require('parse-dashboard');
const resolve = require('path').resolve;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

console.log('dirname', __dirname)
var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/parsedev',
    // databaseURI: databaseUri || 'mongodb://neilsoutar:neil1966@ds149258.mlab.com:49258/parsetest',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    },

    // email config
    // verifyUserEmails: true,
    emailAdapter: {
        module: 'parse-server-mailgun',
        options: {
            // The address that your emails come from
            fromAddress: 'DNS-Parse-Server-Test <noreply@dns-parse-server-test.com>',
            // Your domain from mailgun.com
            domain: 'sandbox3ecf55c5e2a44480af97f09c7e9c6708.mailgun.org',
            // Your API key from mailgun.com
            apiKey: 'key-f3aa2926c0a4002d220ddfbdbf37edb6',
            // The template section
            templates: {
                testTemplate: {
                    subject: 'Reset your password',
                    pathPlainText: resolve(__dirname, 'templates/testTemplate.txt'),
                    pathHtml: resolve(__dirname, 'templates/testTemplate.html')
                }
                // Now you can use {{firstName}} in your templates
            }
        }
    }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey


// Parse dashboard
var allowInsecureHTTP = false;
var dashboard = new ParseDashboard({
    'apps': [{
        'serverURL': process.env.SERVER_URL || 'http://localhost:1337/parse',
        'appId': process.env.APP_ID || 'myAppId',
        'masterKey': process.env.MASTER_KEY || 'myMasterKey',
        'appName': 'MyApp'
    }],
    'users': [{
        'user':'admin',
        'pass':'password'
    },{
        'user':'user',
        'pass':'password'
    }],
    'useEncryptedPasswords': false,
    'trustProxy': 1
}, allowInsecureHTTP);

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/test.html'));
});

// Parse Server plays nicely with the rest of your web routes
app.use('/', dashboard);
// app.get('/', function(req, res) {
//     res.status(200).send('I dream of being a website.  Welcome to your parse server.');
// });

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
