'use strict';

var app     = require('../../server.js');
var request = require('co-supertest').agent(app.listen());
var expect  = require('chai').expect;
var helpers = require('../helpers');

describe('GET /api/stations', function() {
  beforeEach(helpers.resetDB);

  it('should return a list of stations', function *() {
    var res = yield request.get('/api/stations').expect(200).end();
    var stations = res.body.stations;

    expect(stations).to.be.a('array');
    expect(stations[0]).to.be.a('object');
  });
});
