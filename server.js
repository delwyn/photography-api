'use strict'

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const Boom        = require('boom')
const koa         = require('koa')
const bodyParser  = require('koa-bodyparser')
const compressor  = require('koa-compressor')
const conditional = require('koa-conditional-get')
const cors        = require('koa-cors')
const etag        = require('koa-etag')
const json        = require('koa-json')
const jwt         = require('koa-jwt')
const config      = require('config')

config.env = env

const routes = require('./app/routes')
const app = module.exports = koa()

app.use(bodyParser())
app.use(conditional())
app.use(cors())
app.use(etag())
app.use(json())
app.use(compressor())

// Error handling
app.use(function* (next) {
  try {
    yield next
  } catch (err) {
    err = Boom.wrap(err, err.status, err.message)
    this.status = err.output.statusCode
    this.body = err.output.payload
    this.app.emit('error', err, this)
  }
})

if (env === 'development') app.use(require('koa-logger')())

app.use(routes.publicRouter.routes())
app.use(routes.authRouter.routes())
app.use(routes.adminRouter.routes())

if (!module.parent) {
  app.listen(config.port, config.host, function () {
    console.log(`Server[${env}] running on ${config.host}:${config.port}`)
  })
}
