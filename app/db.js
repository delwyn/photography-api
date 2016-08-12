'use strict'

const config = require('config')

module.exports = require('monk')(`localhost/photography-${config.env}`)
