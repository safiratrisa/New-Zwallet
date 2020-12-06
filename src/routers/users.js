const express = require('express')
const router = express.Router()
const {getTransHistory,getProfile,getUsers,deleteUsers,getPhone, getBalance,getSearchReceiver, registerUser,updatePassword,verifyAccount,loginUser,sendEmail,updateImage} = require('../controllers/users')
const {uploadMulter} = require('../middleware/upload')
const{verifyAccess} = require('../middleware/auth')
const {adminCheck} = require('../middleware/admincheck')
const {accountVerification} = require('../middleware/verification')
const {cacheAllUser,delCacheUser,getDetailUser} = require('../middleware/redis')

router
  .get('/:id/transactions-history',verifyAccess,accountVerification,getDetailUser,getTransHistory)
  .post('/register', uploadMulter.single('image'), registerUser)
  .put('/:id/updatepassword',verifyAccess,accountVerification, updatePassword)
  .put('/verify/:sendid',verifyAccess,accountVerification,verifyAccount)
  .put('/:id/updateimage',verifyAccess,accountVerification,uploadMulter.single('image'), updateImage)
  .post('/login', loginUser)
  .post('/email', verifyAccess,accountVerification, sendEmail)
  .get('/:id/profile',verifyAccess,accountVerification,getProfile)
  .get('/:id/balance',verifyAccess,accountVerification, getBalance)
  .get('/:id/receiver',verifyAccess,accountVerification,getSearchReceiver)
  .delete('/:id',verifyAccess,accountVerification, adminCheck, deleteUsers)
  .get('/',verifyAccess,accountVerification,adminCheck, getUsers)
  .get('/:id/phone',verifyAccess,accountVerification,getPhone)

module.exports = router
