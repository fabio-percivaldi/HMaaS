'use strict'

let savedValue
class HashMap {
  constructor() {
    savedValue = null
  }
  set(key, value) {
    savedValue = value
    return value
  }
  // eslint-disable-next-line no-unused-vars
  get(key) {
    return savedValue
  }
}

module.exports = HashMap
