'use strict'

let savedValue
class HashMap {
  constructor() {
    savedValue = []
  }
  set(key, value) {
    savedValue[key] = value
    return value
  }
  // eslint-disable-next-line no-unused-vars
  get(key) {
    return savedValue[key] || null
  }
}

module.exports = HashMap
