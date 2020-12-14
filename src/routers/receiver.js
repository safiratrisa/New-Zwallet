const express = require('express')
const router = express.Router()
const {getSearchById,insertTransfer,deleteSearch, insertSubscription} = require('../controllers/receiver')
const{verifyAccess} = require('../middleware/auth')
const {uploadMulter} = require('../middleware/upload')
const {adminCheck} = require('../middleware/admincheck')
const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')
const {accountVerification} = require('../middleware/verification')

router
  // .get('/:id', verifyAccess,accountVerification,getSearchById)
  // .post('/', verifyAccess,accountVerification,insertSearch)
  // .delete('/:id',verifyAccess,accountVerification,deleteSearch)
  .get('/:id', getSearchById)
  .post('/transfer', insertTransfer)
  .post('/subscription', insertSubscription)
  .delete('/:id',deleteSearch)
module.exports = router
