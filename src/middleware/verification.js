const helpers = require('../helpers/helpers')
exports.accountVerification = function (req, res, next) {
    console.log('abcd')
    console.log(req.isActive)
    if(req.isActive == 2) {
        next()
    } else {
        return helpers.response(res, null, 400, { message: 'Akun belum diverifikasi! ' })
    }
}