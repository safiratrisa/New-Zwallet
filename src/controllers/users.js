const modelUsers = require('../models/users')
const helpers = require('../helpers/helpers')
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { getPhone,insertUsers,checkUser, updateUsersPut,getTransHistory,updateUsersPutSendid,getProfile,getBalance,getSearchReceiver,deleteUsers,getUsers } = require('../models/users');
const jwt = require('jsonwebtoken');
const {sendEmail} =require('../helpers/email')
const redis = require("redis");
const client = redis.createClient();

const users = {
  registerUser: (req, res) => {
    const { firstname, lastname, username, email, password, pin, main_phone, roleID } = req.body
  
    checkUser(email)
      .then(result => {
        // const resultUsers = result
        console.log(result.length)
        if(result.length>0) {return helpers.response(res, null, 402, { message: 'email is already exist' })}
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            fileType = req.file.mimetype
            fileSize = req.file.size
            maxSize = 1*1024*1024
            if (fileType == "image/png" || fileType == "image/jpg" || fileType == "image/jpeg") {
              if(fileSize <= maxSize) {
                const emailto = req.body.emailto
                  const message = req.body.message
                  sendEmail(emailto, message)
                  .then((result)=>{
                    const data = {
                      firstname,
                      lastname,
                      username,
                      email,
                      password: hash,
                      pin,
                      main_phone,
                      image: `${process.env.BASE_URL}/upload/${req.file.filename}`,
                      roleID,
                      sendid: rand,
                      isActive: 1,
                      createdAt: new Date()
                    }
                    console.log(data.sendid)
                    insertUsers(data) 
                    .then(()=> {
                      return helpers.response(res, { message: 'register berhasil, silahkan cek email untuk verifikasi akun' }, 200, null)
                    })
                    .catch((err) => {
                      console.log(err)
                      return helpers.response(res, null, 500, { message: 'problem with database' })
                      })
                    // return helpers.response(res, { message: 'register berhasil, cek email untuk verifikasi' }, 200, null)
                  })
                  .catch((err)=>{
                    return helpers.response(res, null, 400, {message: 'error send email'})
                  })
                  }  else {
                  return helpers.response(res, null, 500, { message: 'File must be 1Mb or lower' })
                }
              } else {
              return helpers.response(res, null, 500, { message: 'Only .png, .jpg and .jpeg format allowed!' })
            }
        })
    })
  })
  },
  loginUser: (req, res) => {
    const {email, password} = req.body
    // const email = req.body.email
    // console.log(email)
    checkUser(email)
      .then(result => {
        const users = result[0]
        console.log(users)
        bcrypt.compare(password, users.password, function(err, resCheck) {
          if(!resCheck) {return helpers.response(res, null, 401, { message: 'Wrong Password' })}
          delete users.password

          // jsonwebtoken
          const option = {
            expiresIn: '6h'
          }
          const payload = {
            userID: users.id,
            email: users.email,
            roleID: users.roleID,
            isActive: users.isActive
          }
          jwt.sign(payload, process.env.SECRET_KEY, option, function(err, token) {
            users.token = token
            return helpers.response(res, users, 200, null)
          })
        })
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
    },
  updatePassword: (req, res,next) => {
    const id = req.params.id
    const {password} = req.body
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        const data = {
          password: hash
        }
        console.log(data.password)
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
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
        })
    })
  },
  updateImage: (req, res, next) => {
    const id = req.params.id
    const data = { image: `${process.env.BASE_URL}/upload/${req.file.filename}` }
    fileType = req.file.mimetype
    fileSize = req.file.size
    maxSize = 1*1024*1024
    if (fileType == "image/png" || fileType == "image/jpg" || fileType == "image/jpeg") {
      if(fileSize <= maxSize) {
        updateUsersPut(id,data) 
        .then((result)=> {
          if (result.affectedRows === 0) {
            const error = new Error('id not found')
            error.status = 404
            return next(error)
          }
          return helpers.response(res, { message: 'update image berhasil' }, 200, null)
        })
        .catch((err) => {
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
      }  else {
        return helpers.response(res, null, 500, { message: 'File must be 1Mb or lower' })
      }
    } else {
      return helpers.response(res, null, 500, { message: 'Only .png, .jpg and .jpeg format allowed!' })
    }
  },
  getTransHistory: (req, res, next) => {
    const typeSort = req.query.type || 'DESC'
    const sortData= req.query.sort || 'datetime'
    const id = req.params.id
    const { page, limit } = req.query
    getTransHistory(id,page,limit,typeSort, sortData)
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        client.setex('getAllUserby'+id, 60*60, JSON.stringify(resultUsers))
        helpers.response(res, resultUsers, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  sendEmail: (req,res) => {
    const email = req.body.email
    const message = req.body.message
    sendEmail(email, message)
    .then((result)=>{
      return helpers.response(res, {message: 'send email success'}, 200,null)
    })
    .catch((err)=>{
      return helpers.response(res, null, 400, {message: 'error send email'})
    })
    },
    verifyAccount: (req, res, next) => {
      const sendid = req.params.sendid
      const data = { isActive: 2 }
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
        console.log(err)
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
            const error = new Error('id not found')
            error.status = 404
            return next(error)
          }
          helpers.response(res, resultUsers, 200, null)
        })
        .catch((err) => {
          console.log(err)
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
            const error = new Error('id not found')
            error.status = 404
            return next(error)
          }
          helpers.response(res, resultUsers, 200, null)
        })
        .catch((err) => {
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
    },
    getSearchReceiver: (req, res, next) => {
      const id = req.params.id
      const { page, limit } = req.query
      const search = '%' + req.query.search + '%' || null
      getSearchReceiver(id,page,limit,search)
        .then(result => {
          const resultUsers = result
          if (resultUsers.length === 0) {
            const error = new Error('id not found')
            error.status = 404
            return next(error)
          }
          helpers.response(res, resultUsers, 200, null)
        })
        .catch((err) => {
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
    },
    deleteUsers: (req, res, next) => {
      const id = req.params.id
      deleteUsers(id)
        .then(result => {
          const resultUsers = result
          if (resultUsers.length === 0) {
            const error = new Error('id not found')
            error.status = 404
            return next(error)
          }
          helpers.response(res, resultUsers, 200, null)
        })
        .catch((err) => {
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
    },
    getUsers: (req, res) => {
      getUsers()
        .then(result => {
          const resultUsers = result
          helpers.response(res, resultUsers, 200, null)
        })
        .catch((err) => {
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
    },
    getPhone: (req, res, next) => {
      const id = req.params.id
      const { page, limit } = req.query
      getPhone(id,page,limit)
        .then(result => {
          const resultUsers = result
          if (resultUsers.length === 0) {
            const error = new Error('id not found')
            error.status = 404
            return next(error)
          }
          helpers.response(res, resultUsers, 200, null)
        })
        .catch((err) => {
          console.log(err)
          return helpers.response(res, null, 500, { message: 'problem with database' })
        })
    },
}

module.exports = users
