require('dotenv').config()

//for HEROKU
const Sequelize = require('sequelize')
var database = process.env.DATABASE_URL || process.env.DBNAME
var sequelize = ""

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(database)
}
else {
  sequelize = new Sequelize(database, 'postgres', '', {
    dialect: 'postgres'
  });
}

const postgres = {
  auth: {
    secret: process.env.DBSECRET
  },
  username: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  jwt_token_expire: '30 days',
  dialect: 'postgres',
  pool: {
    max: (process.env.DBPOOLMAX && parseInt(process.env.DBPOOLMAX)) || 10,
    min: (process.env.DBPOOLMIN && parseInt(process.env.DBPOOLMIN)) || 0,
    acquire: 20 * 60 * 1000,
    idle: ((process.env.DBPOOLIDLE && parseInt(process.env.DBPOOLIDLE)) || 10) * 1000
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  timezone: '+07:00'
}


module.exports = {
  production: {
    use_env_variable: "DATABASE_URL"
  },
  app: {
    id: process.env.APP_ID || '',
    name: process.env.APP_NAME || 'Microservice',
    port: process.env.PORT || 8080,
    code: process.env.APP_CODE,
    environments: process.env.NODE_ENV
  },
  postgres: postgres,
  development: postgres
}
