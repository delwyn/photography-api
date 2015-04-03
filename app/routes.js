'use strict';

var app      = require('../server');
var photos   = require('./controllers/photos');
var lines    = require('./controllers/lines');
var stations = require('./controllers/stations');

app.get('/api/photos', photos.index);
app.get('/api/lines', lines.index);
app.get('/api/stations', stations.index);
