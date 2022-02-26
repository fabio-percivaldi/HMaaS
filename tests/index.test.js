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

const mockRegister = (metrics) => {
  const returnMetrics = metrics
  return {
    metrics: async() => {
      return new Promise(res => {
        res(returnMetrics)
      })
    },
  }
}
const mockGetCounter = {
  inc: () => {
    return null
  },
}

const mockSetCounter = {
  inc: () => {
    return null
  },
}

const request = require('supertest')
const user1Auth = 'dXNlcjpwYXNzd29yZA=='
const user2Auth = 'dXNlcjI6cGFzc3dvcmQy'
const expectedResult = 'expected_metrics'

tap.test('HashMap', async test => {
  const routes = await routesBuilder(redisClient, mockRegister(expectedResult), mockGetCounter, mockSetCounter)

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

  test.test('set a value - incorrect body', async testCase => {
    app.use(routes)
    const response = await request(app)
      .post('/set')
      .send({ wrong_key: 'key1', value: 'value1' })
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${user1Auth}`)

    testCase.equal(response.status, 400)
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
  const routes = await routesBuilder(redisClient, mockRegister(expectedResult), mockGetCounter, mockSetCounter)

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

tap.test('Prometheus - metrics', async test => {
  test.test('get metric', async testCase => {
    const routes = await routesBuilder(redisClient, mockRegister(expectedResult), mockGetCounter, mockSetCounter)
    const key = 'key1'
    app.use(routes)

    await request(app)
      .get(`/get/${key}`)
      .set('Authorization', `Basic ${user1Auth}`)

    const response = await request(app)
      .get(`/-/metrics`)
      .set('Authorization', `Basic ${user1Auth}`)

    const { text: metrics } = response
    testCase.equal(metrics, expectedResult)
    testCase.end()
  })

  test.teardown(async() => {
    await redisClient.disconnect()
  })
  test.end()
})
