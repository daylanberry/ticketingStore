import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@dbtickets/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  queueGroupName = 'orders-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message){}

}