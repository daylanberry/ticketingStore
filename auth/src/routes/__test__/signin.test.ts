import request from "supertest";
import { app } from "../../app";

it('fails when a email does not exist is supplied', async() => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'day@gmail.com',
      password: '1234'
    })
    .expect(400);
});

it ('fails when an incorrect password is suppliced', async() => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'day@gmail.com',
      password: '1234'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'day@gmail.com',
      password: '12345'
    })
    .expect(400)
});

it ('respnodes with a cookie when given valid credentials', async() => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "day@gmail.com",
      password: "1234",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "day@gmail.com",
      password: "1234",
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();

})