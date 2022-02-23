'use strict'

const tap = require('tap')
const HashMap = require('../src/hashMap')

tap.test('HashMap - set', test => {
  test.test('set a value', testCase => {
    const expectedResult = 'value'
    const hashMap = new HashMap()
    const actualResult = hashMap.set('key', 'value')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set a different value', testCase => {
    const expectedResult = 'different_value'

    const hashMap = new HashMap()
    const actualResult = hashMap.set('key', 'different_value')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values', testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    const hashMap = new HashMap()
    const actualResult1 = hashMap.set('key', 'value1')
    const actualResult2 = hashMap.set('key', 'value2')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })
  test.end()
})

tap.test('HashMap - get', test => {
  test.test('get a non existing value', testCase => {
    const expectedResult = null

    const hashMap = new HashMap()
    const actualResult = hashMap.get('key')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.end()
})

tap.test('HashMap - set and get - ', test => {
  test.test('set a value and get it', testCase => {
    const expectedResult = 'value'

    const hashMap = new HashMap()
    hashMap.set('key', 'value')
    const actualResult = hashMap.get('key')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values and get it', testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    const hashMap = new HashMap()
    hashMap.set('key1', 'value1')
    hashMap.set('key2', 'value2')

    const actualResult1 = hashMap.get('key1')
    const actualResult2 = hashMap.get('key2')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })

  test.end()
})

