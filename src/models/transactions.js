const connection = require('../configs/db')

const transactions = {
  getTransactionsById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT account.username,account.mainPhone, account.firstname, account.lastname, transactions.id, transactions.amountIn, transactions.amountOut, transactions.datetime, transactions.notes, action.actionName from account INNER JOIN transactions ON transactions.transferto = account.id INNER jOIN action ON action.actionId=transactions.actionid_transactions WHERE transactions.id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getTransactionsStatus: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT max(id) AS lastId from transactions', (error, results) => {
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
