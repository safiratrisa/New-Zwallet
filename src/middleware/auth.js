const jwt = require('jsonwebtoken');
const helpers =  require('../helpers/helpers')

exports.verifyAccess = (req,res,next) => {
    const authorization = req.headers.authorization
    if(!authorization) {
        return helpers.response(res, null, 401, {message : 'Server Need Token'}) 
    }
    let token = authorization.split(" ")
    token = token[1]
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) {
            if(err.name === 'JsonWebTokenError'){
                return helpers.response(res, null, 401, {message : 'Invalid Token'})
            } else if (err.name === 'TokenExpiredError'){
                return helpers.response(res, null, 401, {message : 'Token Expired'})
            }
          }
          req.myId = decoded.userID
          req.roleID = decoded.roleID
          req.isActive = decoded.isActive
          next()
        })
}