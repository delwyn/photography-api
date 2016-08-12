'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const co = require('co')
const _  = require('lodash')

const db           = require('../app/db')
const linesData    = require('./data/lines')
const photosData   = require('./data/photos')
const stationsData = require('./data/stations')

const Photo   = db.get('photos')
const Station = db.get('stations')
const Line    = db.get('lines')

function* reset() {
  Line.remove({})
  Station.remove({})
  Photo.remove({})
}

function* importLines() {
  let i = 0
  while (i < linesData.length) {
    let line = yield Line.insert(linesData[i++])
    console.log(`# ${line.id} ${line.name}`)
  }

  let count = yield Line.count()
  console.log(`Total Lines: ${count}`)
}

function* importStations() {
  let i = 0
  while (i < stationsData.length) {
    let station = stationsData[i++]
    station.id = i
    let ids = station.lineIds
    delete station.lineIds

    let lines = yield Line.find({ id: { $in: ids }})

    station.lines = _.pluck(lines, '_id')

    station = yield Station.insert(station)

    console.log(`# ${station.id} ${station.name}`)
  }

  let count = yield Station.count()
  console.log(`Total Stations: ${count}`)
}

function* importPhotos() {
  let i = 0
  while (i < photosData.length) {
    let photo = photosData[i++]
    let ids = photo.stationIds

    delete photo.stationIds
    delete photo.id

    let stations = yield Station.find({ id: { $in: ids }})

    photo.stations = _.pluck(stations, '_id')

    photo = yield Photo.insert(photo)
  }

  let count = yield Photo.count()
  console.log(`Total Photos: ${count}`)
}

function* cleanup() {
  yield Line.update({}, { $unset: { id: '' } }, { multi: true })
  yield Station.update({}, { $unset: { id: '' } }, { multi: true })
}

co(function* () {
  yield* reset()
  yield* importLines()
  yield* importStations()
  yield* importPhotos()
  yield* cleanup()
  db.close()
}).catch(function (e) {
  console.log(e)
  db.close()
})
