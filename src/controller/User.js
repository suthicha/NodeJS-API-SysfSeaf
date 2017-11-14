var jwt = require('jsonwebtoken');
var squel = require('squel');
var dbHelper = require('../core/dbHelper');
var httpResponse = require('../core/HttpResponse');
var settings = require('../settings');

exports.authenticate = function(req, resp) {
  if (!req.body) throw new Error("Input not valid");

  try {

    var data = req.body;

    if(data) {
      
      var sql = squel.select()
      .from("User")
      .field("[Username]")
      .where("[Username] = ?", data.Username)
      .where("[Password] = ?", data.Password)
      .where("[ProjectName] = ?", data.ProjectName)
      .where("[Status] = ?", "A")
      .toString();

      dbHelper.executed(sql, function(callback, err) { 
        if (err){
          httpResponse.show500(req, resp, err);
        }
        else { 
          if (data && callback.length > 0) {
            var userCallback = callback[0];
            if(userCallback.Username === req.body.Username) { 
              
              var _encodeToken = jwt.sign({
                Username: userCallback.Username},
                settings.secret, {
                  expiredIn: 3600
              });

              resp.writeHead(200, {"Content-Type":"application/json"});
              resp.write(JSON.stringify({
                auth:{
                  authenticated:true,
                  status: 'success',
                  message:'',
                  token: _encodeToken
                },
                user:{
                  Username: userCallback.Username
                  }
                }));
              resp.end();
            }
            else { 
              httpResponse.sendAuthFail(req, resp, "Username or password an incorrect.");
            }
          }
          else { 
            httpResponse.sendAuthFail(req, resp, "Find not found your username!!!");
          }
        }
      });
    }
  }catch(err){
    httpResponse.show500(req, resp, ex);
  }

}