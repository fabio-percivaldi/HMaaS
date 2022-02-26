'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const basicAuth = require('express-basic-auth')
const { calculateUsers } = require('./src/users')
// PROMETHEUS setup
const client = require('prom-client')
const { Counter, register } = client

const getCounter = new Counter({
  name: 'get_item',
  help: 'User request a Get on an item',
  labelNames: ['user'],
})
const setCounter = new Counter({
  name: 'set_item',
  help: 'User request a Set on an item',
  labelNames: ['user'],
})
// REDIS setup
const { createClient } = require('redis')
const {
  REDIS_URL,
  USERS,
} = process.env

const redisClient = createClient({
  url: REDIS_URL,
})
const app = express()
const port = 3000
const logger = require('pino')()
const routesBuilder = require('./routes')


routesBuilder(redisClient, register, getCounter, setCounter).then(routes => {
  app.use(bodyParser.json())
  let separatedUsers = {}

  if (USERS) {
    separatedUsers = calculateUsers(USERS)
  }

  app.use(basicAuth({
    users: separatedUsers,
  }))
  app.use(routes)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
  })
})
