const modelPhone = require('../models/phone')
const helpers = require('../helpers/helpers')
const phone = {
  getPhoneById: (req, res, next) => {
    const id = req.params.id
    modelPhone.getPhoneById(id)
      .then(result => {
        const resultPhone = result
        if (resultPhone.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, resultPhone, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  insertPhone: (req, res) => {
    const { phoneNumber, accountid_phone } = req.body
    const data = { phoneNumber, accountid_phone }
    modelPhone.insertPhone(data)
      .then(result => {
        const resultPhone = result
        helpers.response(res, resultPhone, 201, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
    deletePhone: (req, res, next) => {
    const id = req.params.id
    modelPhone.deletePhone(id)
      .then(result => {
        const resultPhone = result
        if (resultPhone.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, resultPhone, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  updatePhone: (req, res, next) => {
    const id = req.params.id
    const phoneNumber = req.body.phoneNumber
    const data = {phoneNumber}
    modelPhone.updatePhone(id, data)
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

module.exports = phone
