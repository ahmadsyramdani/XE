const request = require('supertest')
const app = require('../app')

describe('Checking apps', () => {
  it('should success to access web root', async () => {
    const res = await request(app)
      .get('/')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
  })

  it('should success to access web health', async () => {
    const res = await request(app)
      .get('/health')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
  })

  it('should success to access web version', async () => {
    const res = await request(app)
      .get('/version')
      .set({ ContentType: 'application/json' })
    expect(res.statusCode).toEqual(200)
  })
})
