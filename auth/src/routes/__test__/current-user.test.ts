import request from 'supertest';
import { app } from '../../app';
import { signupRouter } from '../signup';


it('responds with details about the current user', async() => {

  const cookie = await global.signin()

  const response = await request(app)
    .get('/api/users/currentUser')
    .set('Cookie', cookie)
    .send()
    .expect(400)

  expect(response.body.currentUser.email).toEqual('d@gmail.com')
});

it('respondds with null if not authenticated', async() => {
  const response = await request(app)
    .get('/api/users/currentUser')
    .send()
    .expect(200)

  expect(response.body.currentUser).toEqual(null)
})