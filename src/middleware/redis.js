const redis = require("redis");
const client = redis.createClient(6379);

const {response} = require('../helpers/helpers')

exports.cacheAllUser =(req,res,next) => {
    client.get('getAllUser', function (err,data) {
        console.log(err)
        
        if(data!==null) {
            const result = JSON.parse(data)
            return response(res,result,200,null)
        } else {
            next()
        }
    })
}

exports.delCacheUser = (req,res, next) => {
    client.del('getAllUser')
    next()
}

exports.getDetailUser =(req,res,next) => {
    const id = req.params.id
    client.get('getAllUserby'+id, function (err,data) {
        console.log(err)
        
        if(data!==null) {
            const result = JSON.parse(data)
            return response(res,result,200,null)
        } else {
            next()
        }
    })
}