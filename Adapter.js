'use strict';
var mysql = require("mysql");
var Q = require('q')

var options = {
  "host": process.env.MYSQL_HOST || "industrysoundbites.com",
  "port": process.env.MYSQL_PORT || "3306",
  "user": process.env.MYSQL_USER || "industry_sound",
  "password": process.env.MYSQL_PASSWORD || "w@rr7x*I+gfv",
  "database": process.env.MYSQL_DATABASE || "industry_soundbites",
  "multipleStatements": true
};

function Adapter() {
  if (this instanceof Adapter) {
    // this.root = new Firebase(process.env.FIREBASE_URL || "https://glaring-heat-2025.firebaseio.com/");
    this.db = mysql.createPool(options);
  } else {
    return new Adapter();
  }
}

Adapter.prototype.InsertVideoUrl = function(post_id, video_url) {
  var deferred = Q.defer();
  const query = "INSERT INTO `wp_postmeta` (post_id, meta_key, meta_value) VALUES " +
    "(" + post_id + ", 'video_url', " + this.db.escape(video_url) + ")"


  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        console.log(query)
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          console.log(results)
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("InsertVideoUrl function finished")
  return deferred.promise;
}

module.exports = Adapter;
