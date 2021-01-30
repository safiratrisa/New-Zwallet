const helpers = require('../helpers/helpers')
exports.accountVerification = function (req, res, next) {
    hasil = req.users
    if(parseInt(hasil.isActive) === 2) {
        return helpers.response(res, hasil, 200, null)
    } else {
        return helpers.response(res, null, 400, { message: 'Akun belum diverifikasi! ' })
    }
}