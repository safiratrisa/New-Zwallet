require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT
const cors = require('cors')
const routerUsers = require('./src/routers/users')
const routerTransactions = require('./src/routers/transactions')
const routerPhone = require('./src/routers/phone')
const bodyParser = require('body-parser')
const helpers = require('./src/helpers/helpers')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/upload', express.static('./upload'))
app.use('/image', express.static('./image'))

app.use('/users', routerUsers)
app.use('/transactions', routerTransactions)
app.use('/phone', routerPhone)

app.use((err, req, res, next) => {
  helpers.response(res, null, err.status, { message: err.message })
})

app.use('*', (req, res) => {
  helpers.response(res, null, 404, { message: 'URL not Found!' })
})

app.listen(PORT, () => console.log(`server is running port ${PORT}`))
