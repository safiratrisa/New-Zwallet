const {countFriends} = require('../models/users')

exports.pagination = async(id, firstname, limit, page)=>{
  const friends = await countFriends(id, firstname)
  const totalData = friends[0].totalData
  const totalPage = Math.ceil(totalData / limit)
  const setPagination = {
    totalData: totalData,
    totalPage,
    currentPage: page,
    perPage: limit
  }
  return setPagination
}