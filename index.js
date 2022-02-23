'use strict'

const express = require('express')
const app = express()
const port = 3000
const HashMap = require('./src/hashMap.js')
const logger = require('pino')()

app.post('/set', (req, res) => {
  HashMap.set()
  res.status(204).send()
})

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`)
})
