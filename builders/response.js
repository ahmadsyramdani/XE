function sendResponse (res, code, message, data, error) {
  res.status(code)
  const result = { message: message }
  if (data) {
    result.data = data
  }
  if (error) {
    result.error = error
  }
  res.json(result)
}

function buildFileResponse (res, code, mimeType, fileName, data) {
  res.status(code)

  if (fileName) {
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
  }
  res.setHeader('Content-type', mimeType);
  res.end(Buffer.from(data), 'binary')
}

function buildError (code, message, referenceId) {
  const result = { }
  result.code = code
  if (message instanceof Error) {
    result.message = message.message
  } else {
    result.message = message
  }
  result.referenceId = referenceId
  return result
}

module.exports = {
  customResponse: sendResponse,
  buildError,
  prepareListResponse: function (page, total, array, limit) {
    const result = {
      page: page,
      count: array.length,
      limit: limit,
      total: total,
      result: array
    }
    return result
  },
  ok: function (res, message, data) {
    sendResponse(res, 200, message, data)
  },
  created: function (res, message, data) {
    sendResponse(res, 201, message, data)
  },
  accepted: function (res, message, data) {
    sendResponse(res, 202, message, data)
  },
  badRequest: function (res, message, err) {
    let code = 400
    let msg = message
    if (message.code) {
      code = message.code
      msg = message.message
    }
    sendResponse(res, code, msg, null, err)
  },
  unauthorised: function (res, message, err) {
    sendResponse(res, 401, message, null, err)
  },
  notFound: function (res, message, err) {
    sendResponse(res, 404, message, null, err)
  },
  conflict: function (res, message, err) {
    sendResponse(res, 409, null, err)
  },
  internalError: function (res, message, err) {
    sendResponse(res, 500, null, err)
  },
  excelFile: function (res, fileName, data) {
    buildFileResponse(res, 200, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName, data)
  }
}
