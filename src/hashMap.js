'use strict'

let savedValue
class HashMap {
  constructor() {
    savedValue = []
  }
  set(key, value, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    savedValue[key] = { value, user: inputUser }
    return value
  }
  // eslint-disable-next-line no-unused-vars
  get(key, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    const foundValue = savedValue[key]
    if (!foundValue) {
      return null
    }
    const { value, user } = foundValue
    if (inputUser !== user) {
      return null
    }
    return value
  }
}

module.exports = HashMap
