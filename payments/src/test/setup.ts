import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { stripeApiKey } from '../../keys'

declare global {
  namespace NodeJS {
    interface Global {
      signin(id? : string): string[]
    }
  }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = stripeApiKey;

let mongo: any;
beforeAll(async() => {
  process.env.JWT_KEY = 'secret'
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async() => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})


afterAll(async() => {
  await mongo.stop();

  await mongoose.connection.close()
});

global.signin = (id?: string) => {
  // Build a jwt payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'd@gmail.com'
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // build session object
  const session = { jwt: token }

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take the JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`express:sess=${base64}`];
}