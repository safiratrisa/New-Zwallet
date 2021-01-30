const helpers = require('../helpers/helpers')
const {countUserPhone} = require('../helpers/count')
const { getPhoneByUserId, insertPhone, deletePhone } = require('../models/phone');
const phone = {
  getPhoneByUserId: async(req, res, next) => {
    const id = req.params.id
    const setphone = await countUserPhone(id)
    getPhoneByUserId(id)
      .then(result => {
        const resultPhone = result
        if (resultPhone.length === 0) {
          return helpers.response(res, {phones:[], total: setphone}, 200, null)
        }
        helpers.response(res, {phones: resultPhone, total: setphone}, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  insertPhone: (req, res) => {
    const { phoneNumber, accountid_phone } = req.body
    const data = { phoneNumber, accountid_phone }
    insertPhone(data)
      .then(result => {
        const resultPhone = result
        helpers.response(res, resultPhone, 201, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
    deletePhone: (req, res, next) => {
    const id = req.params.id
    deletePhone(id)
      .then(result => {
        const resultPhone = result
        if (resultPhone.length === 0) {
          return helpers.response(res, [], 200, null)
        }
        helpers.response(res, resultPhone, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  }
}

module.exports = phone
