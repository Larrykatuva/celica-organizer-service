import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './database/connection';
import { SharedModule } from './shared/shared.module';
import { CountryModule } from './country/country.module';
import { RolesModule } from './roles/roles.module';
import { OrganizerModule } from './organizer/organizer.module';
import { KycModule } from './kyc/kyc.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
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
