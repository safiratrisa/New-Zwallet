const modelSearch = require('../models/receiver')
const helpers = require('../helpers/helpers')
const search = {
  getSearchById: (req, res, next) => {
    const id = req.params.id
    modelSearch.getSearchById(id)
      .then(result => {
        const resultSearch = result
        if (resultSearch.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, resultSearch, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  insertSearch: (req, res) => {
    const { receivername, receiverphone, accountid_receiver } = req.body
    const data = {
      receivername, 
      receiverphone,
      accountid_receiver,
      transferId : 2
    }
    modelSearch.insertSearch(data)
      .then(result => {
        const resultSearch = result
        helpers.response(res, resultSearch, 201, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
//   updateSearchPut: (req, res, next) => {
//     const idTransfer = req.params.idTransfer
//     const name = req.body.name
//     const phoneNumber = req.body.phoneNumber
//     const data = { name, phoneNumber }
//     modelSearch.updateSearchPut(idTransfer, data)
//       .then(result => {
//         const resultSearch = result
//         if (resultSearch.length === 0) {
//           const error = new Error('id not found')
//           error.status = 404
//           return next(error)
//         }
//         helpers.response(res, resultSearch, 200, null)
//       })
//       .catch((err) => {
//         console.log(err)
//         return helpers.response(res, null, 500, { message: 'problem with database' })
//       })
//   },
//   updateSearchPatch: (req, res, next) => {
//     const idTransfer = req.params.idTransfer
//     const name = req.body.name
//     const phoneNumber = req.body.phoneNumber
//     const data = {}
//     if (name) {
//       data.name = name
//     }
//     if (phoneNumber) {
//       data.phoneNumber = phoneNumber
//     }

//     modelSearch.updateSearchPatch(idTransfer, data)
//       .then(result => {
//         const resultSearch = result
//         if (resultSearch.length === 0) {
//           const error = new Error('id not found')
//           error.status = 404
//           return next(error)
//         }
//         helpers.response(res, resultSearch, 200, null)
//       })
//       .catch((err) => {
//         console.log(err)
//         return helpers.response(res, null, 500, { message: 'problem with database' })
//       })
//   },
  deleteSearch: (req, res, next) => {
    const id = req.params.id
    modelSearch.deleteSearch(id)
      .then(result => {
        const resultSearch = result
        if (resultSearch.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, resultSearch, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  }
}

module.exports = search
