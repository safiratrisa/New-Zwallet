const helpers = require('../helpers/helpers')
exports.adminCheck = function (req, res, next) {
    console.log(req.roleID)
    if(req.roleID == 1) {
        next()
    } else {
        return helpers.response(res, null, 400, { message: 'Access Denied! ' })
    }
}