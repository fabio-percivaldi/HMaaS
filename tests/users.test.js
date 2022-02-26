'use strict'

const tap = require('tap')
const { calculateUsers } = require('../src/users')


tap.test('calculate user', test => {
  test.test('single user is passed', testCase => {
    const users = 'user1:password1'
    const expectedResult = { user1: 'password1' }
    const actualResult = calculateUsers(users)

    testCase.strictSame(actualResult, expectedResult)
    testCase.end()
  })

  test.end()
})
