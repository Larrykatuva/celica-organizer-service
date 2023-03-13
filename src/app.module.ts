import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseConfig from './database/connection';
import { SharedModule } from './shared/shared.module';
import { CountryModule } from './country/country.module';
import { RolesModule } from './roles/roles.module';
import { OrganizerModule } from './organizer/organizer.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfig,
    SharedModule,
    CountryModule,
    RolesModule,
    OrganizerModule,
    KycModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
