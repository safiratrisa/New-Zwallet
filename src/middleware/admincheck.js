const helpers = require('../helpers/helpers')
exports.adminCheck = function (req, res, next) {
    if(req.roleID == 1) {
        next()
    } else {
        return helpers.response(res, null, 400, { message: 'Access Denied! ' })
    }
}