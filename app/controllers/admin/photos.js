'use strict'

const db = require('../../db')
const Photo = db.get('photos')

exports.index = function* () {
  this.body = {
    photos: yield Photo.find()
  }
}

exports.create = function* (next) {
  yield Photo.insert(this.request.body.photo)
  this.status = 201
}

exports.update = function* (next) {
  yield Photo.update({ slug: this.params.id }, { $set: this.request.body.photo })
  this.status = 200
}

exports.delete = function* (next) {
  yield Photo.remove({ slug: this.params.id })
  this.status = 200
}
