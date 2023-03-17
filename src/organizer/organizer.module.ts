import { CacheModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CountryModule } from '../country/country.module';
import { OrganizerService } from './services/organizer.service';
import { OrganizerController } from './controller/organizer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './entity/organizer.entity';
import { CacheConfigService } from '../config/redis';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { AffiliateService } from './services/affiliate.service';
import { Affiliate } from './entity/affiliate.entity';
import { AffiliateController } from './controller/affiliate.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizer, Affiliate]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    HttpModule,
    SharedModule,
    CountryModule,
    CqrsModule,
    RolesModule,
  ],
  providers: [OrganizerService, AffiliateService],
  controllers: [OrganizerController, AffiliateController],
  exports: [OrganizerService],
})
export class OrganizerModule {}
