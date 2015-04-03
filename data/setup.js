process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = require('../app/db');
var co = require('co');

var linesData    = require('./lines');
var photosData   = require('./photos');
var stationsData = require('./stations');

var photosCollection   = db.get('photos');
var stationsCollection = db.get('stations');
var linesCollection    = db.get('lines');

function* reset() {
  linesCollection.remove({});
  stationsCollection.remove({});
  photosCollection.remove({});
}

function* importLines() {
  var i = 0;
  while (i < linesData.length) {
    var line = yield linesCollection.insert(linesData[i++]);
    console.log(`# ${line.id} ${line.name}`);
  }

  var count = yield linesCollection.count();
  console.log(`Total Lines: ${count}`);
}

function* importStations() {
  var i = 0;
  while (i < stationsData.length) {
    var station = stationsData[i++];
    station.id = i;
    var ids = station.lineIds;
    delete station.lineIds;

    var lines = yield linesCollection.find({ id: { $in: ids }});

    station.lines = lines.map(function(line) {
      return line._id;
    });

    station = yield stationsCollection.insert(station);

    console.log(`# ${station.id} ${station.name}`);
  }

  var count = yield stationsCollection.count();
  console.log(`Total Stations: ${count}`);
}

function* importPhotos() {
  var i = 0;
  while (i < photosData.length) {
    var photo = photosData[i++];
    var ids = photo.stationIds;

    delete photo.stationIds;
    delete photo.id;

    var stations = yield stationsCollection.find({ id: { $in: ids }});

    photo.stations = stations.map(function(station) {
      return station._id;
    });

    photo = yield photosCollection.insert(photo);
  }

  var count = yield photosCollection.count();
  console.log(`Total Photos: ${count}`);
}

function* cleanup() {
  yield linesCollection.update({}, { $unset: { id: '' } }, { multi: true });
  yield stationsCollection.update({}, { $unset: { id: '' } }, { multi: true });
}

co(function* () {
  yield* reset()
  yield* importLines();
  yield* importStations();
  yield* importPhotos();
  yield* cleanup();

  db.close();
}).catch(function(e) {
  console.log(e);
  db.close();
});
