const express = require('express')
const router = express.Router()
const {getTransactionsById, getTransactionsStatus } = require('../controllers/transactions')
const{verifyAccess} = require('../middleware/auth')
// const {uploadMulter} = require('../middleware/upload')
// const {adminCheck} = require('../middleware/admincheck')
// const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')
// const {accountVerification} = require('../middleware/verification')

router
  .get('/status', verifyAccess, getTransactionsStatus)
  .get('/:id', verifyAccess, getTransactionsById)

module.exports = router
