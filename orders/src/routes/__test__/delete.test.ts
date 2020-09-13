import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';

import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async() => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'title',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  })

  await ticket.save()

  const user = global.signin()

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id})
    .expect(201)

  // make request to cancell order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // write expectation to make sure ticket is cancelled
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

});

it('emits a order cancelled event', async() => {

  const ticket = Ticket.build({
    title: 'title',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save()

  const user = global.signin()

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make request to cancell order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

})