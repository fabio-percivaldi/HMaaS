'use strict'

const tap = require('tap')
const routes = require('../routes')
const express = require('express')
const basicAuth = require('express-basic-auth')
const bodyParser = require('body-parser')
const app = express()
app.use(basicAuth({
  users: { 'user': 'password' },
}))
app.use(bodyParser.json())

const request = require('supertest')
const userPassword = 'dXNlcjpwYXNzd29yZA=='

tap.test('HashMap - set and get', test => {
  test.test('set a value', async testCase => {
    app.use(routes)
    const response = await request(app)
      .post('/set')
      .send({ key: 'key1', value: 'value1' })
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${userPassword}`)

    testCase.equal(response.status, 204)
    testCase.end()
  })

  test.test('set a value and get it', async testCase => {
    const key = 'key1'
    app.use(routes)
    await request(app)
      .post('/set')
      .send({ key, value: 'value1' })
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${userPassword}`)

    const response = await request(app)
      .get(`/get/${key}`)
      .set('Authorization', `Basic ${userPassword}`)

    testCase.equal(response.status, 200)
    testCase.equal(response.text, 'value1')

    testCase.end()
  })
  test.end()
})


tap.test('HashMap - unauthorized get', async test => {
  const key = 'key1'

  app.use(routes)

  const response = await request(app)
    .get(`/get/${key}`)

  test.equal(response.status, 401)
  test.end()
})
