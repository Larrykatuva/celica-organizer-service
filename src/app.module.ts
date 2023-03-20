import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './database/connection';
import { SharedModule } from './shared/shared.module';
import { CountryModule } from './country/country.module';
import { RolesModule } from './roles/roles.module';
import { OrganizerModule } from './organizer/organizer.module';
import { KycModule } from './kyc/kyc.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    DatabaseConfig,
    SharedModule,
    CountryModule,
    RolesModule,
    OrganizerModule,
    KycModule,
  ],
  controllers: [],
})
export class AppModule {}
