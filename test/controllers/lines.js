'use strict'

const app     = require('../../server.js')
const request = require('co-supertest').agent(app.listen())
const expect  = require('chai').expect
const helpers = require('../helpers')

describe('Lines', function () {
  describe('GET /api/v1/lines', function () {
    beforeEach(helpers.resetDB)

    it('should return a list of lines', function* () {
      const res = yield request.get('/api/v1/lines').expect(200).end()
      const lines = res.body.lines

      expect(lines).to.be.a('array')
      expect(lines[0]).to.be.a('object')
    })
  })
})
