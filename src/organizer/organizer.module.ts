import { CacheModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CountryModule } from '../country/country.module';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './organizer.entity';
import { CacheConfigService } from '../config/redis';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizer]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    HttpModule,
    SharedModule,
    CountryModule,
  ],
  providers: [OrganizerService],
  controllers: [OrganizerController],
  exports: [OrganizerService],
})
export class OrganizerModule {}
