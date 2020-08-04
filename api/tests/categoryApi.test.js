const request = require('supertest')
const { Category } = require('../models/')
const app = require('../app')

describe('Categories Endpoints', () => {
  it('should fetch category list', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("messages", "Category results")
  })

  it('should category detail not found', async () => {
    const res = await request(app)
      .get('/api/categories/5b060c6d-4970-4a0b-8ed4-fe776db3218c')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("messages", "Data not found")
  })

  it('should failed to fetch category id', async () => {
    const res = await request(app)
      .get('/api/categories/5b060')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty("messages", "Invalid input syntax for type uuid")
  })

  it('should succed to fetch category detail', async () => {
    const category = await Category.findAll({ limit: 1 })
    const res = await request(app)
      .get(`/api/categories/${category[0].id}`)
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("messages", "Ok")
  })
})
