'use strict'

const db = require('../db')
const Photo = db.get('photos')

exports.index = function* () {
  this.body = {
    photos: yield Photo.find()
  }
}
