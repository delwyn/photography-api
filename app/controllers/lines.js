'use strict';

var db = require('../db');
var lines = db.get('lines');

exports.index = function *(next) {
  var self = this;

  yield lines.find({}, {}, function(err, lines) {
    self.body = {
      lines: lines
    };
  });

  yield next;
};
