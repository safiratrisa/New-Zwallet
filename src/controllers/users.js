const helpers = require('../helpers/helpers')
const bcrypt = require('bcrypt');
const { updateUsersPutEmail,updateUsersPutReset,getPhone,getFriends,transferlogic, transferlogic2,checkPassword,insertUsers,checkUser, updateUsersPut,getTransHistory,updateUsersPutSendid,getProfile,getBalance,getSearchReceiver,deleteUsers,getUsers } = require('../models/users');
const jwt = require('jsonwebtoken');
const {sendEmail} =require('../helpers/email')
const {sendEmailReset} =require('../helpers/emailreset')
const fs = require('fs');
const crypto = require('crypto')
const {pagination} = require('../helpers/pagination')
const {paginationTrans} = require('../helpers/paginationtrans')
const {v4: uuidv4 } = require('uuid')
// const redis = require("redis");
// const client = redis.createClient();


const users = {
  resetPassword: (req, res, next) => {
    const { email } = req.body
    checkUser(email)
    .then((res2)=> {
      if(res2.length===0) {return helpers.response(res, null, 402, { message: 'Email Not Found!' })}
      resetverification = crypto.randomBytes(5).toString('hex')
      const data = { reset: resetverification }
      updateUsersPutEmail(email, data)
      .then((result)=> {
        const senddata = {
          resetid: data.reset,
          email: email
        }
        res.locals.senddata = senddata
        return next()
      })
    })
  },
  sendEmailReset: (req,res) => {
    senddata = res.locals.senddata
    sendEmailReset() 
    .then(()=> {
      return helpers.response(res, { message: 'kirim email berhasil'}, 200, null)
    })
    .catch(()=> {
      return helpers.response(res, null, 400, {message: 'error send email'})
    })
  },
  updatePasswordReset: (req, res,next) => {
    const {reset, newPassword, reenterPassword } = req.body
    if(newPassword !== reenterPassword) {return helpers.response(res, null, 401, { message: 'Password tidak sama' })}
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newPassword, salt, function(err, hash) {
        const newPassword = hash
        const data = {
          password: newPassword,
          reset: 'done'
        }
        updateUsersPutReset(reset,data) 
        .then((result)=> {
          if (result.affectedRows === 0) {
            return helpers.response(res, null, 500, { message: 'kode verifikasi tidak ditemukan' })
          }
          return helpers.response(res, { message: 'update password berhasil' }, 200, null)
        })
        .catch((err) => {
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
      })
    })
  },
  registerUser: (req, res, next) => {
    const { username, email, password, pin } = req.body
    sendid = crypto.randomBytes(50).toString('hex')
    checkUser(email)
    .then(result => {
      if(result.length>0) {return helpers.response(res, null, 402, { message: 'email is already exist' })}
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash1) {
          bcrypt.hash(pin, salt, function(err, hash2) {
            const data = {
              id: uuidv4(),
              firstname: ' ',
              lastname: ' ',
              username,
              email,
              password: hash1,
              pin: hash2,
              mainPhone: ' ',
              roleID: 1,
              isActive: 1, 
              sendid:0, 
              createdAt: new Date(),
              sendid,
              image: `${process.env.BASE_URL}/image/user.png`
            }
            insertUsers(data) 
          .then(()=> {
            const senddata = {
              sendid: data.sendid,
              username: data.username,
              email: data.email
            }
            res.locals.senddata = senddata
            return next()
          })
          .catch((err) => {
            return helpers.response(res, null, 500, { message: 'problem with database' })
          })
          } )
        })
      })
    })
  },
  
  sendEmailVerification: (req,res) => {
    senddata = res.locals.senddata
    sendEmail() 
    .then(()=> {
      return helpers.response(res, { message: 'register berhasil, silahkan cek email untuk verifikasi akun'}, 200, null)
    })
    .catch(()=> {
      return helpers.response(res, null, 400, {message: 'error send email'})
    })
  },
  
  loginUser: (req, res, next) => {
    const {email, password} = req.body
    checkUser(email)
    .then(result => {
      const users = result[0]
      bcrypt.compare(password, users.password, function(err, resCheck) {
        if(!resCheck) {return helpers.response(res, null, 401, { message: 'Wrong Password' })}
        delete users.password
        delete users.pin
        
        const option = {
          expiresIn: '12h'
        }
        
        const payload = {
          userID: users.id,
          email: users.email,
          roleID: users.roleID,
          isActive: users.isActive
        }
        
        jwt.sign(payload, process.env.SECRET_KEY, option, function(err, token) {
          users.token = token
          req.users = users
          return next()
        })
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  
  verifyAccount: (req, res, next) => {
    const sendid = req.params.sendid
    const data = { isActive: 2, sendid: 0 }
    updateUsersPutSendid(sendid,data) 
    .then((result)=> {
      if (result.affectedRows === 0) {
        const error = new Error('verifikasi tidak berhasil, silahkan registrasi ulang')
        error.status = 404
        return next(error)
      }
      return helpers.response(res, { message: 'verifikasi berhasil, silahkan login ulang' }, 200, null)
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },

  updatePassword: (req, res,next) => {
    const id = req.params.id
    const {password, newPassword, reenterPassword } = req.body
    if(newPassword !== reenterPassword) {return helpers.response(res, null, 401, { message: 'Password tidak sama' })}
    checkPassword(id)
    .then(result => {
      const users = result[0]
      bcrypt.compare(password, users.password, function(err, resCheck) {
        if(!resCheck) {return helpers.response(res, null, 401, { message: 'Wrong Password' })}
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newPassword, salt, function(err, hash) {
            const newPassword = hash
            const data = {
              password: newPassword
            }
            updateUsersPut(id,data) 
            .then((result)=> {
              if (result.affectedRows === 0) {
                const error = new Error('id not found')
                error.status = 404
                return next(error)
              }
              return helpers.response(res, { message: 'update password berhasil' }, 200, null)
            })
            .catch((err) => {
              return helpers.response(res, null, 500, { message: 'problem with database' })
            })
          })
        })
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },

  updatePin: (req, res,next) => {
    const id = req.params.id
    const {pin, newPin } = req.body
    checkPassword(id)
    .then(result => {
      const users = result[0]
      bcrypt.compare(pin, users.pin, function(err, resCheck) {
        if(!resCheck) {return helpers.response(res, null, 401, { message: 'Wrong PIN' })}
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newPin, salt, function(err, hash) {
            const newPin = hash
            const data = {
              pin: newPin
            }
            updateUsersPut(id,data) 
            .then((result)=> {
              if (result.affectedRows === 0) {
                const error = new Error('id not found')
                error.status = 404
                return next(error)
              }
              return helpers.response(res, { message: 'update pin berhasil' }, 200, null)
            })
            .catch((err) => {
              return helpers.response(res, null, 500, { message: 'problem with database' })
            })
          })
        })
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },

  updateFirstName: (req, res, next) => {
    const id = req.params.id
    const firstname = req.body.firstname
    const data = {firstname}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          return helpers.response(res, [], 200, null)
        }
        helpers.response(res, { message: 'First Name updated' }, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },

  updateMainPhone: (req, res, next) => {
    const id = req.params.id
    const mainPhone = req.body.mainPhone
    const data = {mainPhone}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          return helpers.response(res, [], 200, null)
        }
        helpers.response(res, { message: 'Main Phone Updated' }, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },

  updateLastName: (req, res, next) => {
    const id = req.params.id
    const lastname = req.body.lastname
    const data = {lastname}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          return helpers.response(res, [], 200, null)
        }
        helpers.response(res, { message: 'Last Name updated' }, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },

  updateEmail: (req, res, next) => {
    const id = req.params.id
    const email = req.body.email
    const data = {email}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          return helpers.response(res, [], 200, null)
        }
        helpers.response(res, { message: 'Last Name updated' }, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },

  updateImage: (req, res, next) => {
    const id = req.params.id
    getProfile(id)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        return helpers.response(res, [], 200, null)
      }
      const dataResults = resultUsers[0]
      const oldImage = dataResults.image
      const defaultImage = `${process.env.BASE_URL}/image/user.png`
      if(oldImage !== defaultImage){
        const replaceFileName = oldImage.replace(`${process.env.BASE_URL}/upload/`, '')
        fs.unlink(`./upload/${replaceFileName}`, err =>{
          if(err) {
          const error = new Error('Failed to Delete')
          return next(error)
        }
        })
      }
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
    const data = { image: `${process.env.BASE_URL}/upload/${req.file.filename}` }
    updateUsersPut(id,data) 
    .then((result)=> {
      if (result.affectedRows === 0) {
        return helpers.response(res, [], 200, null)
      }
      return helpers.response(res, { message: 'update image berhasil' }, 200, null)
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },

  getTransHistory: async(req, res, next) => {
    const sort = req.query.sort || 'DESC'
    const id = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const offset = (page - 1) * limit
    const setPagination = await paginationTrans(id,limit, page)
    getTransHistory(id, sort, limit, offset)
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          return helpers.response(res, {transactions: [], pagination: setPagination}, 200, null)
        }
        helpers.response(res, {transactions: resultUsers, pagination: setPagination}, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  getFriends: async(req, res, next) => {
    const id = req.params.id
    const firstname = req.query.firstname || '' // SEARCH
    const sort = req.query.sort || 'ASC' // SEARCH
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 4
    const offset = (page - 1) * limit
    const setPagination = await pagination(id, firstname, limit, page)
    getFriends(id, firstname, sort,limit, offset)
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          return helpers.response(res, {users: [], pagination:setPagination}, 200, null)
        }
        helpers.response(res, {users: resultUsers, pagination: setPagination}, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  
  getProfile: (req, res, next) => {
    const id = req.params.id
    const { page, limit } = req.query
    getProfile(id,page,limit)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        return helpers.response(res, [], 200, null)
      }
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  
  getBalance: (req, res, next) => {
    const id = req.params.id
    const { page, limit } = req.query
    getBalance(id,page,limit)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        return helpers.response(res, [], 200, null)
      }
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  transferlogic: (req, res, next) => {
    const accountid_transactions = req.params.idsend
    const transferto = req.params.idrec
    const {amountOut, notes, pin} = req.body

    checkPassword(accountid_transactions)
    .then(result => {
      const users = result[0]
      bcrypt.compare(pin, users.pin, function(err, resCheck) {
        if(!resCheck) {return helpers.response(res, null, 401, { message: 'Wrong PIN' })}
        const data = { 
          amountOut, 
          amountIn: 0, 
          accountid_transactions, 
          actionid_transactions: 2, 
          transferto,
          datetime: new Date(),
          notes
        }
        transferlogic(data)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        return helpers.response(res, [], 200, null)
      }
      const data2 = {
        amountIn: data.amountOut, 
        amountOut: 0,
        accountid_transactions: data.transferto,
        actionid_transactions: 1, 
        transferto: data.accountid_transactions,
        datetime: data.datetime
      }
      transferlogic2(data2)
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
      })
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  topuplogic: (req, res, next) => {
    const accountid_transactions = req.params.idrec
    const {amountIn} = req.body
    const data = { 
      amountIn, 
      amountOut: 0,
      accountid_transactions, 
      actionid_transactions: 4, 
      datetime: new Date(),
    }
    transferlogic(data)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        return helpers.response(res, [], 200, null)
      }
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  }
}

module.exports = users
