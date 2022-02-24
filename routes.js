'use strict'

const express = require('express')
const router = express.Router()
const HashMap = require('./src/hashMap.js')
const hashMap = new HashMap()
const logger = require('pino')()
const { body: bodyValidator, validationResult } = require('express-validator')

const getUser = (headers) => {
  const { authorization } = headers
  const [, basicAuth] = authorization.split(' ')

  const buff = Buffer.from(basicAuth, 'base64')
  const basicAuthDecoded = buff.toString('ascii')
  return basicAuthDecoded.split(':')[1]
}

router.post('/set',
  bodyValidator('key').isString()
    .notEmpty(),
  bodyValidator('value').isString()
    .notEmpty(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { body, headers } = req
    logger.info('Request body', JSON.stringify(body))
    const { key, value } = body

    const user = getUser(headers)

    logger.info('User', { user })
    hashMap.set(key, value, user)

    res.status(204).send()
  })

router.get('/get/:key', (req, res) => {
  const { params, headers } = req
  const user = getUser(headers)

  const value = hashMap.get(params.key, user)

  res.status(200).send(value)
})

module.exports = router
