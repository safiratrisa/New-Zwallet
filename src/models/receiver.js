const connection = require('../configs/db')

const search = {
  getSearchById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT account.username, addreceiver.* FROM account INNER jOIN addreceiver ON addreceiver.accountid_receiver=account.id WHERE account.id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertSearch: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO addreceiver SET ?', data, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  deleteSearch: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM addreceiver WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
//   updateSearchPut: (idTransfer, data) => {
//     return new Promise((resolve, reject) => {
//       connection.query('UPDATE search_receiver SET ? WHERE idTransfer = ?', [data, idTransfer], (error, results) => {
//         if (!error) {
//           resolve(results)
//         } else {
//           reject(error)
//         }
//       })
//     })
//   },
//   updateSearchPatch: (idTransfer, data) => {
//     return new Promise((resolve, reject) => {
//       connection.query('UPDATE search_receiver SET ? WHERE idTransfer = ?', [data, idTransfer], (error, results) => {
//         if (!error) {
//           resolve(results)
//         } else {
//           reject(error)
//         }
//       })
//     })
//   }
}

module.exports = search
