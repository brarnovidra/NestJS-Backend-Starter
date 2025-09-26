import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any) {
    console.log('📩 Received user.created event:', data);
    await this.emailService.sendWelcomeEmail(data.email, data.fullName);
  }
}
