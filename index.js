'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const app = express()
const port = 3000
const logger = require('pino')()
const routes = require('./routes')

app.use(bodyParser.json())
app.use(routes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`)
})


