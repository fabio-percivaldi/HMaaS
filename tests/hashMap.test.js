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
  test.end()
})
