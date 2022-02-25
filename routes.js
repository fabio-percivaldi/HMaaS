'use strict'

const express = require('express')
const router = express.Router()
const HashMap = require('./src/hashMap.js')
const logger = require('pino')()
const { body: bodyValidator, validationResult } = require('express-validator')

const getUser = (headers) => {
  const { authorization } = headers
  const [, basicAuth] = authorization.split(' ')

  const buff = Buffer.from(basicAuth, 'base64')
  const basicAuthDecoded = buff.toString('ascii')
  return basicAuthDecoded.split(':')[0]
}

module.exports = async(redis) => {
  const hashMap = new HashMap(redis)
  await redis.connect()

  router.post('/set',
    bodyValidator('key').isString()
      .notEmpty(),
    bodyValidator('value').isString()
      .notEmpty(),
    async(req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const { body, headers } = req
      logger.info('Request body', JSON.stringify(body))
      const { key, value } = body

      const user = getUser(headers)
      logger.info({ value, key, user }, 'SET value')

      await hashMap.set(key, value, user)

      res.status(204).send()
    })

  router.get('/get/:key', async(req, res) => {
    const { params, headers } = req
    const user = getUser(headers)

    const value = await hashMap.get(params.key, user)
    logger.info({ value, key: params.key, user }, 'GET value')

    if (!value) {
      res.status(404).send()
      return
    }
    res.status(200).send(value)
  })
  return router
}
