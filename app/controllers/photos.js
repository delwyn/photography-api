'use strict';

var db = require('../db');
var photos = db.get('photos');

exports.index = function *(next) {
  var self = this;

  yield photos.find({}, {}, function(err, photos) {
    self.body = {
      photos: photos
    };
  });

  yield next;
};
