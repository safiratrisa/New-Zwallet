const helpers = require('../helpers/helpers')
const { getTransactionsById, getTransactionsStatus } = require('../models/transactions');

const transactions = {
  getTransactionsById: (req, res, next) => {
    const id = req.params.id
    getTransactionsById(id)
      .then(result => {
        const resultTransactions = result
        if (resultTransactions.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, resultTransactions, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  getTransactionsStatus: (req, res) => {
    getTransactionsStatus()
      .then(result => {
        const resultTransactions = result
        helpers.response(res, resultTransactions, 200, null)
      })
      .catch((err) => {
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  }
}

module.exports = transactions
