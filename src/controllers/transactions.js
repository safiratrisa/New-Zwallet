const modelTransactions = require('../models/transactions')
const helpers = require('../helpers/helpers')
const redis = require("redis");
const client = redis.createClient();

const transactions = {
  getTransactionsById: (req, res, next) => {
    const id = req.params.id
    modelTransactions.getTransactionsById(id)
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
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  insertTransactions: (req, res) => {
    const { amountIn, amountOut, notes, accountid_transactions, actionid_transactions,transferto } = req.body
    const data = {
      amountIn,
      amountOut,
      notes,
      accountid_transactions,
      actionid_transactions,
      transferto,
      datetime: new Date()
    }
    modelTransactions.insertTransactions(data)
    .then(result => {
        const resultTransactions = result
        return helpers.response(res, resultTransactions, 201, null)
    })
    .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  deleteTransactions: (req, res, next) => {
    const id = req.params.id
    modelTransactions.deleteTransactions(id)
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
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  }
}

module.exports = transactions
