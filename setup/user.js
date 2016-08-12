'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const co     = require('co')
const prompt = require('co-prompt')
const bcrypt = require('co-bcrypt')
const db     = require('../app/db')
const User   = db.get('users')

co(function* () {
  let password
  let passwordsMatch = false

  let username = yield prompt('Username: ')
  let email = yield prompt('Email: ')

  while (!passwordsMatch) {
    password = yield prompt.password('Password: ')
    let passwordConfirmation = yield prompt.password('Confirm Password: ')

    if (password === passwordConfirmation) {
      passwordsMatch = true
    } else {
      console.error('\n*** Passwords do not match ***\n')
    }
  }

  let hashedPassword = yield bcrypt.hash(password, 10)

  let user = yield User.insert({
    username: username,
    email: email,
    password: hashedPassword
  })

  console.log('User created')

  process.exit()
})
