import { CacheModule, Module } from '@nestjs/common';
import { RequestService } from './services/request.service';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CacheConfigService } from '../config/redis';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommandHandler } from './commands/handlers/userCommandHandler';

export const CommandHandlers = [UserCommandHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    HttpModule,
    CqrsModule,
  ],
  controllers: [],
  providers: [RequestService, UserService, ...CommandHandlers],
  exports: [RequestService, UserService],
})
export class SharedModule {}
