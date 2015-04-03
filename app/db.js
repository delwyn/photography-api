'use strict';

var config = require('../config');
var db = module.exports = require('monk')(`localhost/photography-${config.env}`);
