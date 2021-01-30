const {countPhone} = require('../models/phone')

exports.countUserPhone = async(id)=>{
  const phone = await countPhone(id)
  const totalData = phone[0].total
  const setCount = {
    totalData: totalData,
  }
  return setCount
}