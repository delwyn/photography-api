'use strict';

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config');

var koa         = require('koa');
var compressor  = require('koa-compressor');
var conditional = require('koa-conditional-get');
var cors        = require('koa-cors');
var etag        = require('koa-etag');
var json        = require('koa-json');
var router      = require('koa-router');

var app  = module.exports = koa();

app.use(conditional());
app.use(cors())
app.use(etag());
app.use(json());
app.use(compressor());
app.use(router(app));

if (env === 'development') {
  app.use(require('koa-logger')())
}

require('./app/routes');

if (!module.parent) {
  app.listen(config.port, config.host, function() {
    console.log(`Server running on ${config.host}:${config.port}`);
  });
}
