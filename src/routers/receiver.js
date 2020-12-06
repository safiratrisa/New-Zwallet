const express = require('express')
const router = express.Router()
const {getSearchById,insertSearch,deleteSearch} = require('../controllers/receiver')
const{verifyAccess} = require('../middleware/auth')
const {uploadMulter} = require('../middleware/upload')
const {adminCheck} = require('../middleware/admincheck')
const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')
const {accountVerification} = require('../middleware/verification')

router
  .get('/:id', verifyAccess,accountVerification,getSearchById)
  .post('/', verifyAccess,accountVerification,insertSearch)
  .delete('/:id',verifyAccess,accountVerification,deleteSearch)

module.exports = router
