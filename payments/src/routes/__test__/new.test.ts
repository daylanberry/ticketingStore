import request from 'supertest';
import { app }from '../../app';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { OrderStatus } from '@dbtickets/common';
import { stripe } from '../../stripe';


it('throws a 404 when an order does not exist', async() => {

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '1234',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)

});

it('returns 401 when purchasing an order that doesnt belong to the user', async() => {

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });

  await order.save();

  const test = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '1234',
      orderId: order.id
    })
    .expect(401)

});

it('returns a 400 when the order is cancelled', async() => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: '1234'
    })
    .expect(400)
});

// it('returnn a 204 with valid inputs', async() => {
//   const userId = mongoose.Types.ObjectId().toHexString();

//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId: userId,
//     version: 0,
//     price: 20,
//     status: OrderStatus.Created
//   });

//   await order.save()

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signin(userId))
//     .send({
//       token: 'tok_visa',
//       orderId: order.id
//     })
//     .expect(201)

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

//   expect(chargeOptions.source).toEqual('tok_visa');
//   expect(chargeOptions.amount).toEqual(20*100)
//   expect(chargeOptions.currency).toEqual('usd')
// })


it('returnn a 204 with valid inputs', async() => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000)

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created
  });

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  });

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toBe('usd')
})