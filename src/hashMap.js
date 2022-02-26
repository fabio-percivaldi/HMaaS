'use strict'
class HashMap {
  constructor(redis) {
    this.redisClient = redis
  }

  async set(key, value, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    await this.redisClient.set(`${inputUser}_${key}`, value)
    return value
  }

  async get(key, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    const value = await this.redisClient.get(`${inputUser}_${key}`)

    return value ? value : null
  }
}

module.exports = HashMap
