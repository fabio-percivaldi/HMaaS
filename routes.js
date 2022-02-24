'use strict'

const express = require('express')
const router = express.Router()
const HashMap = require('./src/hashMap.js')
const hashMap = new HashMap()
const logger = require('pino')()
const { body: bodyValidator, validationResult } = require('express-validator')

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
    const { body } = req
    logger.info('Request body', JSON.stringify(body))
    const { key, value } = body
    hashMap.set(key, value)

    res.status(204).send()
  })

router.get('/get/:key', (req, res) => {
  const value = hashMap.get(req.params.key)
  res.status(200).send(value)
})

module.exports = router
