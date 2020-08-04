const routeNames = require('../config/routeConfig')

class RouteRegistrar {
  constructor (router, moduleName) {
    this.endpointId = 0
    this.router = router
    this.module = moduleName
    this.route = this.route.bind(this)
  }

  route (page, action, ...middleware) {
    const actions = routeNames[page][action]
    this.router[actions.method](actions.uri, (req, res, next) => {
      req.endpointId = routeNames[page][action].id
      next()
    }, ...middleware)
  }
}

module.exports = RouteRegistrar
