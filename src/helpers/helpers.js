module.exports = {
    response: (res, result, status, err) => {
      const resultPrint = {}
      resultPrint.statusCode = status
      resultPrint.result = result
      resultPrint.err = err || null
      if (result === null || result.length === 0) {
        resultPrint.status = 'NOT SUCCESS!'
      } else {
        resultPrint.status = 'SUCCESS!'
      }
      return res.status(resultPrint.statusCode).json(resultPrint)
    }
  }
  