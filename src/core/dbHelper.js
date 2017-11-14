var mssql = require('mssql');
var settings = require('../settings');

exports.executed = function(sql, callback) {
  var conn = new mssql.Connection(settings.dbConfig);
  conn.connect()
    .then(function() {
      var req = new mssql.Request(conn);
      req.query(sql).then(function(recordset) {
        callback(recordset);
      })
      .catch(function(err) { 
        callback(null, err);
      })
    })
    .catch(function(err) {
      callback(null, err);
    })
};

exports.executedWithConnection = function(sql, connection, callback) {
  var conn = new mssql.Connection(connection);
  conn.connect()
    .then(function() {
      var req = new mssql.Request(conn);
      req.query(sql).then(function(recordset) {
        callback(recordset);
      })
      .catch(function(err) { 
        callback(null, err);
      })
    })
    .catch(function(err) {
      callback(null, err);
    })
};