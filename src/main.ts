import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { Transport } from '@nestjs/microservices';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  await app.listen(process.env.PORT || 3000);
  console.log('Listening on', process.env.PORT || 3000);

  // RabbitMQ consumer (EmailService)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'user_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  console.log('🚀 App running at http://localhost:3000 (REST + GraphQL)');
  console.log('📩 Email consumer listening for user.created events...');
}
bootstrap();

