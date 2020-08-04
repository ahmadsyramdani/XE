const request = require('supertest')
const { Product } = require('../models/')
const app = require('../app')

describe('Order Endpoints', () => {
  it('should at lease has one order item', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: "my name",
        email: "email@mailinator.com",
        phoneNumber: "o817273737",
        shippingAddress: "Jl. Gang Guan",
        totalPayment: 400000
      })
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty("messages", "Validation failed")
  })

  it('should have customer name', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        email: "email@mailinator.com",
        phoneNumber: "o817273737",
        shippingAddress: "Jl. Gang Guan",
        totalPayment: 400000
      })
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty("messages", "Validation failed")
  })

  it('should success create order', async () => {
    const product = await Product.findAll({ limit: 1 })
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: "my name",
        email: "email@mailinator.com",
        phoneNumber: "o817273737",
        shippingAddress: "Jl. Gang Guan",
        totalPayment: 400000,
        orderItems: [{
      		productId: product[0].id,
      		quantity: 2
        }]
      })
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty("messages", "Order is successful")
  })
})
