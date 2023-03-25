import { Module } from '@nestjs/common';
import { CountryModule } from '../country/country.module';
import { SharedModule } from '../shared/shared.module';
import { KycMappingService } from './services/kycMapping.service';
import { KycMappingController } from './controllers/kycMapping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycMapping } from './entities/kycMapping.entity';
import { KycContent } from './entities/kycContent.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { RolesModule } from '../roles/roles.module';
import { KycContentController } from './controllers/kycContent.controller';
import { KycContentService } from './services/kycContent.service';
import { OrganizerModule } from '../organizer/organizer.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    SharedModule,
    CountryModule,
    RolesModule,
    CqrsModule,
    OrganizerModule,
    TypeOrmModule.forFeature([KycMapping, KycContent]),
  ],
  providers: [KycMappingService, KycContentService],
  controllers: [KycMappingController, KycContentController],
  exports: [],
})
export class KycModule {}
