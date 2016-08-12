// File required my mocha to setup NODE_ENV

'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'test'

const app = require('../server')
const config = require('config')

app.listen(config.port, config.host)
