'use strict'

const express = require('express')
const app = express()
const port = 3000
const logger = require('pino')()
const routes = require('./routes')

app.use(routes)

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`)
})


