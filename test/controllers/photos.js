var app     = require('../../server.js');
var request = require('co-supertest').agent(app.listen());
var expect  = require('chai').expect;
var helpers = require('../helpers');

describe('GET /api/photos', function () {
  beforeEach(helpers.resetDB);

  it('should return a list of photos', function *() {
    var res = yield request.get('/api/photos').expect(200).end();
    var photos = res.body.photos;

    expect(photos).to.be.a('array');
    expect(photos[0]).to.be.a('object');
  });
});
