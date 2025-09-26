import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { User } from './modules/users/entities/user.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { UsersService } from './modules/users/users.service';
import { UserPublisher } from './events/user.publisher';
import { UserConsumer } from './events/user.consumer';
import { HealthModule } from './modules/health/health.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'admin',
      database: process.env.DB_NAME || 'app_db',
      entities: [User, RefreshToken],
      synchronize: true
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),    
    JwtModule.register({ secret: process.env.JWT_SECRET || 'changeme' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    HealthModule,
    EmailModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, autoSchemaFile: true, path: '/graphql' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UserPublisher, UserConsumer],
})
export class AppModule {}
