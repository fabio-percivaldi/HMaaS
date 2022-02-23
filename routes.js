'use strict'

const express = require('express')
const router = express.Router()
const HashMap = require('./src/hashMap.js')
const hashMap = new HashMap()

router.post('/set', (req, res) => {
  hashMap.set()
  res.status(204).send()
})

router.get('/get', (req, res) => {
  res.status(200).send('value')
})

module.exports = router
