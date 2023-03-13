import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../shared/entities/user.entity';
import { Organizer } from '../organizer/organizer.entity';
import { Country } from '../country/country.entity';
import { UserRole } from '../roles/role.entity';
import { KycMapping } from '../kyc/entities/kycMapping.entity';
import { KycContent } from '../kyc/entities/kycContent.entity';

/**
 * Database connection configurations.
 */
@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: +this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [User, Organizer, Country, UserRole, KycMapping, KycContent],
      synchronize: this.configService.get<boolean>('DATABASE_SYNC'),
      logging: this.configService.get<boolean>('LOGGER'),
      subscribers: [],
      migrations: [],
    };
  }
}

export default TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
});
