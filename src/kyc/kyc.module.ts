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

@Module({
  imports: [
    SharedModule,
    CountryModule,
    RolesModule,
    CqrsModule,
    TypeOrmModule.forFeature([KycMapping, KycContent]),
  ],
  providers: [KycMappingService],
  controllers: [KycMappingController],
  exports: [],
})
export class KycModule {}
