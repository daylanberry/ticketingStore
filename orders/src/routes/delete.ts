import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from '@dbtickets/common';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publish an event saying this was cancelled
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  })

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
