'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const logger = require('pino')()
const routes = require('./routes')

app.use(routes)
app.use(bodyParser.json())

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`)
})


