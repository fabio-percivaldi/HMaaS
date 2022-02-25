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

tap.test('HashMap - set', async test => {
  const hashMap = new HashMap(redisClient)
  await hashMap.redisClient.connect()

  test.test('set a value', async testCase => {
    const expectedResult = 'value'

    await hashMap.redisClient.flushAll()

    const actualResult = await hashMap.set('key', 'value', 'user1')

    testCase.equal(actualResult, expectedResult)

    testCase.end()
  })

  test.test('set a different value', async testCase => {
    const expectedResult = 'different_value'

    await hashMap.redisClient.flushAll()

    const actualResult = await hashMap.set('key', 'different_value', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values', async testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    await hashMap.redisClient.flushAll()

    const actualResult1 = await hashMap.set('key', 'value1', 'user1')
    const actualResult2 = await hashMap.set('key', 'value2', 'user1')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })

  test.test('set a value with user', async testCase => {
    const expectedResult = 'value'

    await hashMap.redisClient.flushAll()

    const actualResult = await hashMap.set('key', 'value', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.teardown(async() => {
    await hashMap.redisClient.disconnect()
  })
  test.end()
})

tap.test('HashMap - get', async test => {
  const hashMap = new HashMap(redisClient)
  await hashMap.redisClient.connect()

  test.test('get a non existing value', async testCase => {
    const expectedResult = null

    await hashMap.redisClient.flushAll()

    const actualResult = await hashMap.get('key', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })
  test.teardown(async() => {
    await hashMap.redisClient.disconnect()
  })
  test.end()
})

tap.test('HashMap - set and get - ', async test => {
  const hashMap = new HashMap(redisClient)
  await hashMap.redisClient.connect()

  test.test('set a value and get it', async testCase => {
    const expectedResult = 'value'

    await hashMap.redisClient.flushAll()

    await hashMap.set('key', 'value', 'user1')
    const actualResult = await hashMap.get('key', 'user1')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values and get it', async testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    await hashMap.redisClient.flushAll()

    await hashMap.set('key1', 'value1', 'user1')
    await hashMap.set('key2', 'value2', 'user1')

    const actualResult1 = await hashMap.get('key1', 'user1')
    const actualResult2 = await hashMap.get('key2', 'user1')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })

  test.test('set a value with user and get it with wrong user', async testCase => {
    const expectedResult = null

    await hashMap.redisClient.flushAll()

    await hashMap.set('key', 'value', 'user1')
    const actualResult = await hashMap.get('key', 'user2')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.teardown(async() => {
    await hashMap.redisClient.disconnect()
  })
  test.end()
})

tap.test('HashMap - Redis persistency', async test => {
  const hashMap = new HashMap(redisClient)
  await hashMap.redisClient.connect()

  test.test('value is stored in Redis', async testCase => {
    const key = 'key1'
    const value = 'value1'

    await hashMap.redisClient.flushAll()

    await hashMap.set(key, value, 'user1')

    const redisValue = await redisClient.get(key)
    const { value: actualValue } = JSON.parse(redisValue)

    testCase.equal(actualValue, value)
    testCase.end()
  })

  test.teardown(async() => {
    await hashMap.redisClient.disconnect()
  })

  test.end()
})

