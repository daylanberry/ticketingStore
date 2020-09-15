import { Subjects, Publisher, ExpirationCompleteEvent } from '@dbtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{

  readonly subject = Subjects.ExpirationComplete
}