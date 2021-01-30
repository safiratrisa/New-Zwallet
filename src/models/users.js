const connection = require('../configs/db')


const users = {
  countFriends: (id, firstname)=>{
    return new Promise((resolve, reject) => {
      if (firstname) {
        connection.query('SELECT COUNT(*) AS totalData FROM account WHERE account.id != ? AND account.firstname LIKE ?', [id, `%${firstname}%`], (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      } else {
        connection.query('SELECT COUNT(*) AS totalData FROM account WHERE account.id != ?', [id], (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      }
    })
  },
  countTrans: (id)=>{
    return new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(*) AS totalTrans FROM transactions WHERE transactions.accountid_transactions = ?', [id], (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
    })
  },
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
  updateUsersPutEmail: (email, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE account SET ? WHERE email = ?', [data, email], (error, results) => {
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
  updateUsersPutReset: (reset, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE account SET ? WHERE reset = ?', [data, reset], (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getTransHistory: (id, sort, limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query(`select transactions.id, receiver.firstname AS receivername, receiver.lastname AS receiverlastname, receiver.image AS receiverimage, transactions.amountIn, transactions.amountOut, transactions.datetime,transactions.actionid_transactions, action.actionName from transactions LEFT JOIN account AS receiver ON transactions.transferto = receiver.id LEFT JOIN action ON transactions.actionid_transactions = action.actionId WHERE transactions.accountid_transactions= ? ORDER BY transactions.datetime ${sort} LIMIT ${limit} OFFSET ${offset}`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getProfile: (id) => {
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
  getBalance: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT account.id, (SUM(amountOut)*-1) + SUM(amountIn) AS balance, SUM(amountIn) AS income, SUM(amountOut) AS outcome FROM account INNER JOIN transactions ON account.id = transactions.accountid_transactions WHERE account.id = ?`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getFriends: (id, firstname, sort, limit, offset) => {
    return new Promise((resolve, reject) => {
      if (firstname) {
        connection.query(`SELECT account.* FROM account WHERE NOT account.id = ? AND account.firstname LIKE ? ORDER BY account.firstname ${sort} LIMIT ${limit} OFFSET ${offset}`, [id, `%${firstname}%`] , (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      } 
      else {
        connection.query(`select account.* FROM account WHERE NOT account.id = ? ORDER BY account.firstname ${sort} LIMIT ${limit} OFFSET ${offset}`, [id], (error, results) => {
          if (!error) {
            resolve(results)
          } else {
            reject(error)
          }
        })
      } 
    })
  },
  transferlogic: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO transactions SET ?`, data, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  transferlogic2: (data2) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO transactions SET ?`, data2, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  }
}

module.exports = users
