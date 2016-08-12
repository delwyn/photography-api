'use strict'

const app     = require('../../server.js')
const request = require('co-supertest').agent(app.listen())
const expect  = require('chai').expect
const helpers = require('../helpers')

describe('Photos', function () {
  describe('GET /api/v1/photos', function () {
    beforeEach(helpers.resetDB)

    it('should return a list of photos', function* () {
      const res = yield request.get('/api/v1/photos').expect(200).end()
      const photos = res.body.photos

      expect(photos).to.be.a('array')
      expect(photos[0]).to.be.a('object')
    })
  })
})
