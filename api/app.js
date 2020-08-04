require('dotenv').config()
const express = require('express')
const cors = require('cors')
const debug = require('debug')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const short = require('short-uuid')
const http = require('http')

const app = express()

app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
  http.createServer(app).listen(process.env.PORT || 80, () => {
    console.log(`Listening on https://localhost:${process.env.PORT || 80}`)
  })
}

app.use(cors())

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

// setup logger
morgan.token('id', function getId (req) {
  return req.id
})
morgan.token('endpointId', function getId (req) {
  return req.endpointId
})
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(assignId)
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
app.use(morgan(':date :id :endpointId :method :url :req[header] :body', { stream: accessLogStream }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))

require('./routes')(app)
if (process.env.NODE_ENV === 'development') {
  require('./helpers/githook')()
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

function assignId (req, res, next) {
  req.id = short.generate()
  const defaultFormatArgs = debug.formatArgs
  debug.formatArgs = function (args) {
    const namespace = this.namespace
    if (this.log) {
      args[0] = `[${namespace}] ${req.id} - ${args[0]}`
    } else {
      defaultFormatArgs.call(this, args)
    }
  }
  next()
}

module.exports = app
