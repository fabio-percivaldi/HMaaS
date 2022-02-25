'use strict'
class HashMap {
  constructor(redis) {
    this.redisClient = redis
  }

  async set(key, value, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    await this.redisClient.set(key, JSON.stringify({ value, user: inputUser }))
    return value
  }

  async get(key, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    const foundValue = await this.redisClient.get(key)
    if (!foundValue) {
      return null
    }
    const { value, user } = JSON.parse(foundValue)
    if (inputUser !== user) {
      return null
    }
    return value
  }
}

module.exports = HashMap
