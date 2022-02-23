'use strict'

const express = require('express')
const router = express.Router()
const HashMap = require('./src/hashMap.js')
const hashMap = new HashMap()
const logger = require('pino')()

router.post('/set', (req, res) => {
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
