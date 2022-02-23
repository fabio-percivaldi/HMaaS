'use strict'

const tap = require('tap')
const HashMap = require('../src/hashMap')

tap.test('HashMap - set', test => {
  test.test('set a value', testCase => {
    const expectedResult = 'value'

    const actualResult = HashMap.set('key', 'value')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set a different value', testCase => {
    const expectedResult = 'different_value'

    const actualResult = HashMap.set('key', 'different_value')

    testCase.equal(actualResult, expectedResult)
    testCase.end()
  })

  test.test('set two different values', testCase => {
    const expectedResult1 = 'value1'
    const expectedResult2 = 'value2'

    const actualResult1 = HashMap.set('key', 'value1')
    const actualResult2 = HashMap.set('key', 'value2')

    testCase.equal(actualResult1, expectedResult1)
    testCase.equal(actualResult2, expectedResult2)
    testCase.end()
  })
  test.end()
})
