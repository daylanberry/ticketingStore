import { Publisher, OrderCreatedEvent, Subjects} from '@dbtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}