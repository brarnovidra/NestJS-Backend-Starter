import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
@Controller()
export class UserConsumer {
  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any){
    console.log('User created event:', data);
  }
}
