const express = require('express')
const router = express.Router()
const {getPhoneById,insertPhone,deletePhone,updatePhone} = require('../controllers/phone')
const{verifyAccess} = require('../middleware/auth')
const {uploadMulter} = require('../middleware/upload')
const {adminCheck} = require('../middleware/admincheck')
const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')
const {accountVerification} = require('../middleware/verification')

router
  .get('/:id', verifyAccess,accountVerification, getPhoneById)
  .post('/',verifyAccess,accountVerification, insertPhone)
  .delete('/:id',verifyAccess,accountVerification, deletePhone)
  .put('/:id',verifyAccess,accountVerification,updatePhone)

module.exports = router
