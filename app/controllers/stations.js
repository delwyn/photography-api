'use strict';

var db = require('../db');
var stations = db.get('stations');

exports.index = function *(next) {
  var self = this;

  yield stations.find({}, {}, function(err, stations) {
    self.body = {
      stations: stations
    };
  });

  yield next;
};
