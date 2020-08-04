
# Xen Electronic Shop

Simple eCommerce

## Getting Started

Clone the codes from the repository
```
https://github.com/ahmadsyramdani/XE
```

### Installing

#### API
```
api$ npm install
```
```
api$ npx sequelize-cli db:migrate
```
```
api$ npm run seed
```

#### WEB
```
xe-web$ yarn install
```
```
Change BASE API url on src/global.js
```
```
xe-web$ yarn start
```


## Running the tests

For check Code Quality
```
api$ npm run jslint / xe-web$ yarn run jslint
```

Run Unit Test

```
api$ npm test
```

## Deployment

### Deploy Web App to github page

```
xe-web$ npm run deploy
```
### Deploy API to heroku

```
api$ git push heroku master
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

***Ahmad Ramdani***

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
