import request from 'supertest';
import { app } from '../../app';

it('Returns a 201 on successfull signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'd@gmail.com',
      password: '1234'
    })
    .expect(201);
});

it ('returns a 400 with invalid email', async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "dgmail.com",
      password: "1234",
    })
    .expect(400);
})

it("returns a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "d@gmail.com",
      password: "12",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: 'd@gmail.com'
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: '1234'
    })
    .expect(400);
});

it ('disallows duplicate emails', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'd@gmail.com',
      password: '1234'
    })
    .expect(201)

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "d@gmail.com",
      password: "1234",
    })
    .expect(400);
})

it ('sets a cookie after successfull signup', async() => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "d@gmail.com",
      password: "1234",
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined()
})

