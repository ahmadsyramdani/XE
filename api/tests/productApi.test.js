const request = require('supertest')
const { Product } = require('../models/')
const app = require('../app')

describe('Products Endpoints', () => {
  it('should fetch product list', async () => {
    const res = await request(app)
      .get('/api/products')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("messages", "Product results")
  })

  it('should product detail not found', async () => {
    const res = await request(app)
      .get('/api/products/5b060c6d-4970-4a0b-8ed4-fe776db3218c')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("messages", "Data not found")
  })

  it('should failed to fetch product id', async () => {
    const res = await request(app)
      .get('/api/products/5b060')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty("messages", "Invalid input syntax for type uuid")
  })

  it('should succed to fetch product detail', async () => {
    const product = await Product.findAll({ limit: 1 })
    const res = await request(app)
      .get(`/api/products/${product[0].id}`)
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("messages", "Ok")
  })
})
