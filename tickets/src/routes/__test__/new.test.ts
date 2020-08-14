import request from 'supertest'
import { app } from '../../app'

it('has a route handler listening to /api/tickets fro post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)

});


it('it can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)

    console.log(response.status)

});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
});


it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400)

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);

});


it("returns an error if invalid price is provided", async () => {

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: 'title'
    })
    .expect(400);

});


it('it creates a ticket with valid inputs', async () => {
  await request(app)
    .post('/api/tickets')
    .send({
      title: 'title',
      price: 20
    })
    .expect(201)
});
