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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizer, Affiliate]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ClientsModule.registerAsync([
      {
        name: 'ORGANIZER_MICROSERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            name: configService.get<string>('KAFKA_NAME'),
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get<string>('KAFKA_CLIENT_ID'),
                brokers: [
                  `${configService.get<string>(
                    'KAFKA_HOST',
                  )}:${configService.get<string>('KAFKA_PORT')}`,
                ],
              },
              consumer: {
                groupId: configService.get<string>('KAFKA_GROUP_ID'),
              },
            },
          };
        },
      },
    ]),
    HttpModule,
    SharedModule,
    CountryModule,
    CqrsModule,
    RolesModule,
  ],
  providers: [OrganizerService, AffiliateService],
  controllers: [OrganizerController, AffiliateController],
  exports: [OrganizerService, AffiliateService],
})
export class OrganizerModule {}
