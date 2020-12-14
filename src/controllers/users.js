const helpers = require('../helpers/helpers')
const bcrypt = require('bcrypt');
const { getPhone,checkPassword,insertUsers,checkUser, updateUsersPut,getTransHistory,updateUsersPutSendid,getProfile,getBalance,getSearchReceiver,deleteUsers,getUsers } = require('../models/users');
const jwt = require('jsonwebtoken');
const {sendEmail} =require('../helpers/email')
const redis = require("redis");
const client = redis.createClient();
const fs = require('fs');
const crypto = require('crypto')


const users = {
  registerUser: (req, res, next) => {
    const { username, email, password } = req.body
    sendid = crypto.randomBytes(50).toString('hex')
    checkUser(email)
    .then(result => {
      console.log(result.length)
      if(result.length>0) {return helpers.response(res, null, 402, { message: 'email is already exist' })}
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          const data = {
            firstname: ' ',
            lastname: ' ',
            username,
            email,
            password: hash,
            pin: ' ',
            mainPhone: ' ',
            roleID: 1,
            isActive: 1, 
            sendid:0, 
            createdAt: new Date(),
            sendid,
            // image: `${process.env.BASE_URL}/upload/${req.file.filename}`
            image: `${process.env.BASE_URL}/image/user.png`
          }
          insertUsers(data) 
          .then(()=> {
            res.locals.sendid = data.sendid
            return next()
          })
          .catch((err) => {
            console.log(err)
            return helpers.response(res, null, 500, { message: 'problem with database' })
          })
        })
      })
    })
  },
  
  sendEmailVerification: (req,res) => {
    const emailto = req.body.emailto
    sendid = res.locals.sendid
    const kripto = 
    sendEmail(emailto) 
    .then(()=> {
      console.log('abcdefg')
      return helpers.response(res, { message: 'register berhasil, silahkan cek email untuk verifikasi akun'}, 200, null)
    })
    .catch(()=> {
      return helpers.response(res, null, 400, {message: 'error send email'})
    })
  },
  
  loginUser: (req, res) => {
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
          return helpers.response(res, users, 200, null)
        })
      })
    })
    .catch((err) => {
      console.log(err)
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
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  
  // updatePassword: (req, res,next) => {
  //   const id = req.params.id
  //   const {password} = req.body
  //   bcrypt.genSalt(10, function(err, salt) {
  //     bcrypt.hash(password, salt, function(err, hash) {
  //       const data = {
  //         password: hash
  //       }
  //       updateUsersPut(id,data) 
  //       .then((result)=> {
  //         if (result.affectedRows === 0) {
  //           const error = new Error('id not found')
  //           error.status = 404
  //           return next(error)
  //         }
  //         return helpers.response(res, { message: 'update password berhasil' }, 200, null)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         return helpers.response(res, null, 500, { message: 'problem with database' })
  //       })
  //     })
  //   })
  // },

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
              console.log(err)
              return helpers.response(res, null, 500, { message: 'problem with database' })
            })
          })
        })
      })
    })
    .catch((err) => {
      console.log(err)
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
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'First Name updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
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
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Main Phone Updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
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
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Last Name updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
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
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Last Name updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },

  updateImage: (req, res, next) => {
    const id = req.params.id
    getProfile(id)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        const error = new Error('id not found')
        error.status = 404
        return next(error)
      }
      const dataResults = resultUsers[0]
      const oldImage = dataResults.image
      console.log(dataResults.image)
      if(oldImage){
        const replaceFileName = oldImage.replace(`${process.env.BASE_URL}/upload/`, '')
        console.log(replaceFileName)
        fs.unlink(`./upload/${replaceFileName}`, err =>{
          if(err) {
          const error = new Error('Failed to Delete')
          return next(error)
        }
        })
      }
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
    const data = { image: `${process.env.BASE_URL}/upload/${req.file.filename}` }
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
    const search = req.query.search || null
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
  }
}

module.exports = users
