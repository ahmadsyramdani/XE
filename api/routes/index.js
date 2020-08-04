module.exports = (app) => {
  app.use('/', require('./web'))
  app.use('/api', require('./order'))
  app.use('/api', require('./product'))
  app.use('/api', require('./category'))
}
