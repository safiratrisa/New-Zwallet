const express = require('express')
const router = express.Router()
const{verifyAccess} = require('../middleware/auth')
const {insertPhone,deletePhone,getPhoneByUserId} = require('../controllers/phone')
// const {uploadMulter} = require('../middleware/upload')
// const {adminCheck} = require('../middleware/admincheck')
// const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')
// const {accountVerification} = require('../middleware/verification')

router
  .get('/:id/user', verifyAccess,getPhoneByUserId)
  .post('/', verifyAccess,insertPhone)
  .delete('/:id', verifyAccess,deletePhone)

module.exports = router
