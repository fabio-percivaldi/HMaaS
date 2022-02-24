'use strict'

const tap = require('tap')
const { createClient } = require('redis')
const HashMap = require('../src/hashMap')
const conf = require('./conf.js')

const {
  REDIS_URL,
} = conf
const redisClient = createClient({
  url: REDIS_URL,
})

tap.test('HashMap - set', test => {
  test.test('set a value', testCase => {
    const expectedResult = 'value'
    const hashMap = new HashMap()
    const actualResult = hashMap.set('key', 'value', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set a different value', testCase => {
    const expectedResult = 'different_value'

    const hashMap = new HashMap()
    const actualResult = hashMap.set('key', 'different_value', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values', testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    const hashMap = new HashMap()
    const actualResult1 = hashMap.set('key', 'value1', 'user1')
    const actualResult2 = hashMap.set('key', 'value2', 'user1')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })

  test.test('set a value with user', testCase => {
    const expectedResult = 'value'
    const hashMap = new HashMap()
    const actualResult = hashMap.set('key', 'value', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })
  test.end()
})

tap.test('HashMap - get', test => {
  test.test('get a non existing value', testCase => {
    const expectedResult = null

    const hashMap = new HashMap()
    const actualResult = hashMap.get('key', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.end()
})

tap.test('HashMap - set and get - ', test => {
  test.test('set a value and get it', testCase => {
    const expectedResult = 'value'

    const hashMap = new HashMap()
    hashMap.set('key', 'value', 'user1')
    const actualResult = hashMap.get('key', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values and get it', testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    const hashMap = new HashMap()
    hashMap.set('key1', 'value1', 'user1')
    hashMap.set('key2', 'value2', 'user1')

    const actualResult1 = hashMap.get('key1', 'user1')
    const actualResult2 = hashMap.get('key2', 'user1')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })

  test.test('set a value with user and get it with wrong user', testCase => {
    const expectedResult = null

    const hashMap = new HashMap()
    hashMap.set('key', 'value', 'user1')
    const actualResult = hashMap.get('key', 'user2')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })
  test.end()
})


tap.test('HashMap - Redis persistency', async test => {
  await redisClient.connect()

  test.test('value is stored in Redis', async testCase => {
    const key = 'key1'
    const value = 'value1'

    const hashMap = new HashMap()
    hashMap.set(key, value, 'user1')

    const redisValue = await redisClient.get(key)

    testCase.equal(redisValue, value)
    testCase.end()
  })

  test.teardown(async() => {
    await redisClient.disconnect()
  })
  test.end()
})

