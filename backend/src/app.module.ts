import { Module } from '@nestjs/common';
import { WishesModule } from './wishes/wishes.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { WishList } from './wishlists/entities/wishlist.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Offer } from './offers/entities/offer.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exeption.filter';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? '127.0.0.1',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, WishList, Wish, Offer],
      synchronize: true,
    }),
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        new winston.transports.File({
          format: winston.format.simple(),
          filename: 'request.log',
          level: 'info',
        }),
        new winston.transports.File({
          format: winston.format.simple(),
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    WishesModule,
    UsersModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
