'use strict'

const app     = require('../../server.js')
const request = require('co-supertest').agent(app.listen())
const expect  = require('chai').expect
const helpers = require('../helpers')

describe('Stations', function () {
  describe('GET /api/v1/stations', function () {
    beforeEach(helpers.resetDB)

    it('should return a list of stations', function* () {
      const res = yield request.get('/api/v1/stations').expect(200).end()
      const stations = res.body.stations

      expect(stations).to.be.a('array')
      expect(stations[0]).to.be.a('object')
    })
  })
})
