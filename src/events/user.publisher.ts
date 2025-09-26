import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
@Injectable()
export class UserPublisher {
  private client: ClientProxy;
  constructor(){
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'user_queue',
        queueOptions: { durable: true }
      }
    });
  }
  async publishUserCreated(payload: any){
    return this.client.emit('user.created', payload).toPromise();
  }
}
