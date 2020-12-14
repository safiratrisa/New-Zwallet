const connection = require('../configs/db')


const users = {
  checkUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM account WHERE email = ?', email, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  checkPassword: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM account WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertUsers: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO account SET ?', data, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  updateUsersPut: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE account SET ? WHERE id = ?', [data, id], (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  updateUsersPutSendid: (sendid, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE account SET ? WHERE sendid = ?', [data, sendid], (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getTransHistory: (id, page, limit,typeSort,sortData) => {
    if (!limit) {
      limit = 20
    }
    if (!page) {
      page = 1
    }
    return new Promise((resolve, reject) => {
      connection.query(`SELECT account.username, transactions.id, transactions.amountIn, transactions.amountOut, transactions.datetime, transactions.notes, addreceiver.receivername, addreceiver.receiverphone, action.actionName from account INNER JOIN transactions ON transactions.accountid_transactions = account.id LEFT JOIN addreceiver ON addreceiver.id = transactions.transferto  INNER jOIN action ON action.actionId=transactions.actionid_transactions WHERE account.id = ? ORDER BY ${sortData} ${typeSort} `, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getProfile: (id, page, limit) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT account.firstName, account.lastname, account.mainPhone, account.email, account.image FROM account WHERE account.id = ?`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getBalance: (id, page, limit) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT account.id, (SUM(amountOut)*-1) + SUM(amountIn) AS balance FROM account INNER JOIN transactions ON account.id = transactions.accountid_transactions WHERE account.id = ?`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getSearchReceiver: (id, page, limit,search) => {
    return new Promise((resolve, reject) => {
      if (search) {
        connection.query(`SELECT account.username, addreceiver.*, action.actionName FROM account INNER JOIN addreceiver ON account.id = addreceiver.accountid_receiver INNER JOIN action ON addreceiver.transferId = action.actionId WHERE addreceiver.receivername LIKE ? AND account.id = ?`,[`%${search}%`,id], (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      } else {
        connection.query(`SELECT addreceiver.id, addreceiver.receivername, addreceiver.receiverphone, action.actionName FROM account INNER JOIN addreceiver ON account.id = addreceiver.accountid_receiver INNER JOIN action ON addreceiver.transferId = action.actionId WHERE account.id = ?`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
      }
    })
  },
  deleteUsers: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM account WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getUsers: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT firstname, lastname, mainPhone,email FROM account`, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  
  getPhone: (id, page, limit) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT account.id, accountphone.phoneNumber FROM account INNER JOIN accountphone WHERE account.id = ?`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
}

module.exports = users
