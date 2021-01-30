const {countTrans} = require('../models/users')

exports.paginationTrans = async(id,limit, page)=>{
  const trans = await countTrans(id)
  const totalData = trans[0].totalTrans
  const totalPage = Math.ceil(totalData / limit)
  const setPagination = {
    totalData: totalData,
    totalPage,
    currentPage: page,
    perPage: limit
  }
  return setPagination
}