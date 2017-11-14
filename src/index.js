import { request } from 'https';

var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var settings = require('./settings');
var httpResponse = require('./core/HttpResponse');

var app = express();
app.set('secert', settings.secret);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, resp) {
  resp.send('The API is at the http://localhost:' + settings.webport + '/seafapi');
});

var apiRoute = express.Router();
apiRoute.post('/authenticate', function(req, resp) { 
  User.authenticate(req, resp);
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoute.use(function(req, resp, next) {
  
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    
    if (token){
      // verifies secret and checks exp
      jwt.verify(token, app.get('secert'), function(err, decoded) {
        if (err) {
          return resp.json({ auth: { authenticated: false, message: 'Failed to authenticate token.'} });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    }
    else {
      // if there is no token
        // return an error
        return resp.status(403).send({
          success: false,
          message: 'No token provided.'
        });
    }
  });


apiRoute.get('/', function(req, resp) {
  httpResponse.showHome(req, resp);
});

app.use('/seafapi', apiRoute);
app.listen(settings.webport);
console.log('WebService started at http://localhost:' + settings.webport);