import { Subjects, OrderCancelledEvent, Publisher } from '@dbtickets/common';

export class OrderCancelledPublisher extends Publisher <OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}