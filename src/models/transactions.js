const connection = require('../configs/db')

const transactions = {
  getTransactionsById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT account.username, transactions.id, transactions.amountIn, transactions.amountOut, transactions.datetime, transactions.notes, addreceiver.receivername, action.actionName from account INNER JOIN transactions ON transactions.accountid_transactions = account.id LEFT JOIN addreceiver ON addreceiver.id = transactions.transferto  INNER jOIN action ON action.actionId=transactions.actionid_transactions WHERE account.id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertTransactions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO transactions SET ?', data, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  deleteTransactions: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM transactions WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  }
}

module.exports = transactions
