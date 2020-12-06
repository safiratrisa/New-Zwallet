const connection = require('../configs/db')

const phone = {
  getPhoneById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT account.username, accountphone.* FROM account INNER jOIN accountphone ON accountphone.accountid_phone=account.id WHERE account.id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertPhone: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO accountphone SET ?', data, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  deletePhone: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM accountphone WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  updatePhone: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE accountphone SET ? WHERE id = ?', [data, id], (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
}

module.exports = phone

