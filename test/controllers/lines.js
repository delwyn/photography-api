'use strict';

var app     = require('../../server.js');
var request = require('co-supertest').agent(app.listen());
var expect  = require('chai').expect;
var helpers = require('../helpers');

describe('GET /api/lines', function() {
  beforeEach(helpers.resetDB);

  it('should return a list of lines', function *() {
    var res = yield request.get('/api/lines').expect(200).end();
    var lines = res.body.lines;

    expect(lines).to.be.a('array');
    expect(lines[0]).to.be.a('object');
  });
});
