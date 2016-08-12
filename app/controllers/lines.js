'use strict'

const db = require('../db')
const Line = db.get('lines')

exports.index = function* () {
  this.body = {
    lines: yield Line.find()
  }
}
