const response = (req, res, status, data, message, errors) => {
  res.status(status)
  res.setHeader('Content-Type', 'application/json')

  const body = {}
  if (data) {
    body.data = data
  }

  if (message) {
    body.messages = message
  }

  if (errors) {
    if (errors instanceof Array) { body.errors = errors } else { body.errors = [errors] }
  }

  if (req.refreshToken) {
    body.token = req.refreshToken
  }

  return res.json(body)
}

module.exports = response
