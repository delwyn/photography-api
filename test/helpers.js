'use strict'

const setup = module.exports = {}

const db = require('../app/db')
const fixtures = require('./fixtures')

const models = ['photos', 'stations', 'lines']

function* loadFixtures(model) {
  const collection = db.get(model)

  yield collection.remove()
  yield collection.insert(fixtures[model])
}

setup.resetDB = function* () {
  for (let i = 0; i < models.length; i++) {
    yield* loadFixtures(models[i])
  }
}
