const express = require('express')
const router = express.Router()
const {getTransactionsById, insertTransactions,deleteTransactions } = require('../controllers/transactions')
const{verifyAccess} = require('../middleware/auth')
const {uploadMulter} = require('../middleware/upload')
const {adminCheck} = require('../middleware/admincheck')
const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')
const {accountVerification} = require('../middleware/verification')

router
  .get('/:id', verifyAccess,accountVerification, getTransactionsById)
  .post('/', verifyAccess,accountVerification, insertTransactions)
  .delete('/:id',verifyAccess,accountVerification,adminCheck, deleteTransactions)

module.exports = router
