'use strict'

const jwt    = require('koa-jwt')
const bcrypt = require('co-bcrypt')
const config = require('config')
const db     = require('../db')
const User   = db.get('users')

function* authenticate(email, password) {
  try {
    const user = yield User.findOne({ email: email })
    return yield bcrypt.compare(password, user.password)
  } catch (e) {
    return false
  }
}

function signToken(email) {
  return jwt.sign({
    email: email,
  }, config.get('jwtSecret'), {
    expiresInMinutes: 60
  })
}

exports.auth = function* () {
  const password = this.request.body.password
  const email = this.request.body.email
  const authenticated = yield authenticate(email, password)

  if (authenticated) {
    this.body = { token: signToken(email) }
  } else {
    // TODO: Use this.throw()
    this.status = 400
    this.body = { error: 'Invalid credentials' }
  }
}

exports.refresh = function* () {
  const oldToken = this.request.header.authorization.split(' ')[1]
  const user = jwt.decode(oldToken)

  this.body = { token: signToken(user.email) }
}
