'use strict'

const jwt          = require('koa-jwt')
const Router       = require('koa-router')
const controllers  = require('./controllers')
const authenticate = jwt({ secret: 'secret' })

const publicRouter = new Router({
  prefix: '/api/v1'
})

publicRouter.get('/photos', controllers.photos.index)
publicRouter.get('/lines', controllers.lines.index)
publicRouter.get('/stations', controllers.stations.index)

const authRouter = new Router({
  prefix: '/api/v1'
})

authRouter.post('/token-auth', controllers.authentication.auth)
authRouter.post('/token-refresh', controllers.authentication.refresh)
authRouter.get('/token-refresh', controllers.authentication.refresh)

const adminRouter = new Router({
  prefix: '/api/v1/admin'
})

adminRouter.use(authenticate)

adminRouter.get('/photos', controllers.admin.photos.index)
adminRouter.post('/photos', controllers.admin.photos.create)
adminRouter.patch('/photos/:id', controllers.admin.photos.update)
adminRouter.delete('/photos/:id', controllers.admin.photos.delete)

module.exports = {
  adminRouter: adminRouter,
  authRouter: authRouter,
  publicRouter: publicRouter
}
