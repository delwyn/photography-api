'use strict';

var setup = module.exports = {};

var db = require('../app/db');
var fixtures = require('./fixtures');

var models = ['photos', 'stations', 'lines'];

function* loadFixtures(model) {
  var collection = db.get(model);

  yield collection.remove();
  yield collection.insert(fixtures[model]);
}

setup.resetDB = function* () {
  for (var i = 0; i < models.length; i++) {
    yield* loadFixtures(models[i]);
  }
}
