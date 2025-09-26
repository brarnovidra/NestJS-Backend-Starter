import { Module } from '@nestjs/common';
import { UserPublisher } from './user.publisher';
import { UserConsumer } from './user.consumer';

@Module({
  providers: [UserPublisher, UserConsumer],
  exports: [UserPublisher],
})
export class EventsModule {}
