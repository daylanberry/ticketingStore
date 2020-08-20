import { Publisher, Subjects, TicketUpdatedEvent } from '@dbtickets/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated
}