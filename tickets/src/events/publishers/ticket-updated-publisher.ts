import { Publisher, Subjects, TicketUpdatedEvent } from '@dbtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated
}