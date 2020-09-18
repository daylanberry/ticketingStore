import { Publisher, PaymentCreatedEvent, Subjects } from '@dbtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated;
}