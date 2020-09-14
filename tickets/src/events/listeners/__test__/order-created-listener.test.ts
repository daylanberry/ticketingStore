import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@dbtickets/common';
import mongoose, { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming'

const setup = async () => {

  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: '1234'
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '1234',
    expiresAt: '1234',
    ticket: {
        id: ticket.id,
        price: ticket.price,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
};

it('sets the userId of the ticket', async() => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const createdTicket = await Ticket.findById(ticket.id)
  expect(createdTicket!.orderId).toEqual(data.id)

});

it('calls the ack message', async() => {

  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()
});

it('publishes a ticket updated event', async() => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(data.id).toEqual(ticketUpdatedData.orderId)

});