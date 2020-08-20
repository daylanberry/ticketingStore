import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent }from './ticket-created-event'
import { Subjects } from './subjects'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payment-service';


  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('event data!', data)

    msg.ack()
  }
}