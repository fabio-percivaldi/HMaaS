'use strict'
class HashMap {
  constructor(redis) {
    this.redisClient = redis
  }

  async set(key, value, inputUser) {
    if (!inputUser) {
      throw new Error('Input user cannot be empty')
    }
    // for admin mode it's better to save an object
    // es:  await this.redisClient.set(`key`, { value, user })
    // and check the user on the get, if admin is used the check is skipped
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
