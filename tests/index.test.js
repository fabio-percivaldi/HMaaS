'use strict'

const tap = require('tap')
const routes = require('../routes')
const express = require('express')
const app = express()

const request = require('supertest')

tap.test('HashMap - set', test => {
  test.test('set a value', async testCase => {
    app.use(routes)
    const response = await request(app)
      .post('/set')
      .send({})

    testCase.equal(response.status, 204)
    testCase.end()
  })
  test.end()
})
