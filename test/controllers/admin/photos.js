'use strict'

const app     = require('../../../server.js')
const db      = require('../../../app/db')
const request = require('co-supertest').agent(app.listen())
const expect  = require('chai').expect
const helpers = require('../../helpers')
const jwt     = require('koa-jwt')
const _       = require('lodash')

const photosCollection = db.get('photos')
const oneHourFromNow = new Date().getTime() + 1000 * 60 * 60
const token = jwt.sign({
  email: 'delwyn.d@gmail.com',
  expires:  + oneHourFromNow
}, 'secret')

const headers = {
  Authorization: `Bearer ${token}`
}

const invalidHeaders = {
  Authorization: 'Bearer invalid'
}

// TODO - should create records for tests

function ensureRouteProtected(req) {
  describe('when not authenticated', function () {
    it('should return 401', function* () {
      const res = yield req.expect(401).end()
      expect(res.body.error).to.eq('Unauthorized')
      expect(res.body.message).to.eq('No Authorization header found\n')
    })
  })
}

describe('Admin Photos', function () {
  beforeEach(helpers.resetDB)

  describe('GET /api/v1/admin/photos', function () {
    ensureRouteProtected(request.get('/api/v1/admin/photos'))

    describe('when authenticated', function () {
      it('should return a list of photos', function* () {
        const res = yield request.get('/api/v1/admin/photos').set(headers).expect(200).end()

        const photos = res.body.photos

        expect(photos).to.be.a('array')
        expect(photos[0]).to.be.a('object')
      })
    })
  })

  describe('POST /api/v1/admin/photos', function () {
    ensureRouteProtected(request.post('/api/v1/admin/photos'))

    describe('when authenticated', function () {
      const photo = {
        name: 'New Photo X',
        description: 'desc',
        lat: '52',
        lng: '-1'
      }

      it('should create a new photo', function* () {
        const res = yield request.post('/api/v1/admin/photos').set(headers).send({ photo: photo}).expect(201).end()
        const lastPhoto = yield photosCollection.findOne({}, { sort: { $natural: -1 }})

        expect(_.omit(lastPhoto, '_id')).to.deep.equal(photo)
      })
    })
  })

  describe('PUT /api/v1/admin/photos/:id', function () {
    ensureRouteProtected(request.patch('/api/v1/admin/photos/photo-1'))

    describe('when authenticated', function () {
      it('should update the photo', function* () {
        const photo = {
          name: 'Updated Photo X',
          description: 'blah',
          lat: '2',
          lng: '5'
        }
        const res = yield request.patch('/api/v1/admin/photos/photo-1').set(headers).send({ photo: photo}).expect(200).end()
        const updatedPhoto = yield photosCollection.findOne({ slug: 'photo-1' })

        expect(_.omit(updatedPhoto, '_id', 'slug')).to.deep.equal(photo)
      })
    })
  })

  describe('DELETE /api/v1/admin/photos/:id', function () {
    beforeEach(function () {
      photosCollection.insert({ name: 'Delete Photo', slug: 'photo-1' })
    })
    ensureRouteProtected(request.delete('/api/v1/admin/photos/photo-1'))

    describe('when authenticated', function () {
      it('should delete the photo', function* () {
        const res = yield request.delete('/api/v1/admin/photos/photo-1').set(headers).expect(200).end()
        const deletedPhoto = yield photosCollection.findOne({ slug: 'photo-1' })

        expect(deletedPhoto).to.equal(null)
      })
    })
  })

})
