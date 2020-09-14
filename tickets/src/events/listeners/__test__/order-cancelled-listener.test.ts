import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '@dbtickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';


const setup = async() => {

  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: mongoose.Types.ObjectId().toHexString()
  });

  ticket.set({ orderId: orderId })

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }

  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { msg, data, ticket, orderId, listener }

};

it('updates the ticket, publishes, an event, and acks the message', async() => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg)

  const newTicket = await Ticket.findById(ticket.id);
  expect(newTicket!.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
