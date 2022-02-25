'use strict'

const basicAuth = require('express-basic-auth')
const bodyParser = require('body-parser')
const routesBuilder = require('../routes')
const { createClient } = require('redis')
const express = require('express')
const tap = require('tap')
const conf = require('./conf')

const {
  REDIS_URL,
} = conf
const redisClient = createClient({
  url: REDIS_URL,
})
const app = express()
app.use(basicAuth({
  users: {
    'user': 'password',
    'user2': 'password2',
  },
}))
app.use(bodyParser.json())

const request = require('supertest')
const user1Auth = 'dXNlcjpwYXNzd29yZA=='
const user2Auth = 'dXNlcjI6cGFzc3dvcmQy'

tap.test('HashMap', async test => {
  const routes = await routesBuilder(redisClient)

  test.test('set a value', async testCase => {
    app.use(routes)
    const response = await request(app)
      .post('/set')
      .send({ key: 'key1', value: 'value1' })
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${user1Auth}`)

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
      .set('Authorization', `Basic ${user1Auth}`)

    const response = await request(app)
      .get(`/get/${key}`)
      .set('Authorization', `Basic ${user1Auth}`)

    testCase.equal(response.status, 200)
    testCase.equal(response.text, 'value1')

    testCase.end()
  })

  test.teardown(async() => {
    await redisClient.disconnect()
  })
  test.end()
})

tap.test('HashMap - basic auth', async test => {
  const routes = await routesBuilder(redisClient)

  test.test('unauthorized get', async testCase => {
    const key = 'key1'

    app.use(routes)

    const response = await request(app)
      .get(`/get/${key}`)

    testCase.equal(response.status, 401)
    testCase.end()
  })

  test.test('user can get his own value', async testCase => {
    const key = 'key1'
    app.use(routes)
    await request(app)
      .post('/set')
      .send({ key, value: 'value1' })
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${user1Auth}`)

    const response = await request(app)
      .get(`/get/${key}`)
      .set('Authorization', `Basic ${user1Auth}`)

    testCase.equal(response.status, 200)
    testCase.equal(response.text, 'value1')

    testCase.end()
  })

  test.test('user1 cannot get user2 values', async testCase => {
    const key = 'key1'
    app.use(routes)
    await request(app)
      .post('/set')
      .send({ key, value: 'value1' })
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${user1Auth}`)

    const response = await request(app)
      .get(`/get/${key}`)
      .set('Authorization', `Basic ${user2Auth}`)

    testCase.equal(response.status, 404)

    testCase.end()
  })

  test.teardown(async() => {
    await redisClient.disconnect()
  })
  test.end()
})
