// const {getTransHistory} = require('../models/users')

// exports.pagination = async(limit,page)=>{
//   const receiver = await getTransHistory
//   const totalData = receiver[0].totalData
//   const totalPage = Math.ceil(totalData / limit)
//   const setPagination = {
//     totalData: totalData,
//     totalPage,
//     currentPage: page,
//     perPage: limit,
//     prevPage: page > 1 ? `${process.env.BASE_URL}/users/:id/receiver?page=${page-1}&limit=${limit}`:null,
//     nextPage: page < totalPage ? `${process.env.BASE_URL}/users/:id/receiver?page=${page + 1}&limit=${limit}` : null,
//   }
//   return setPagination
// }