import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { User } from './models/user.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from '../middleware/currentUser.middleware';
import { JwtStrategy } from '../guards/jwt.strategy';
import { JwtAuthGuard } from '../guards/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy, JwtAuthGuard],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
