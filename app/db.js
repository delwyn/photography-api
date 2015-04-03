'use strict';

var config = require('../config');

module.exports = require('monk')(`localhost/photography-${config.env}`);
