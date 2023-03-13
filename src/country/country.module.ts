import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { SharedModule } from '../shared/shared.module';
import { CountryController } from './country.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    SharedModule,
    CqrsModule,
    RolesModule,
  ],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
