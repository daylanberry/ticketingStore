import { Publisher, Subjects, TicketCreatedEvent } from '@dbtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated
}