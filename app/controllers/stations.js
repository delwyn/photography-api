'use strict'

const db = require('../db')
const Station = db.get('stations')

exports.index = function* () {
  this.body = {
    stations: yield Station.find()
  }
}
