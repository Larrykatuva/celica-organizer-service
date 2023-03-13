import type { RedisClientOptions } from 'redis';
import { CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Redis cache configuration class.
 */
@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}
  createCacheOptions(): RedisClientOptions {
    return {
      url: `${this.configService.get<string>(
        'REDIS_HOST',
      )}:${this.configService.get<string>('REDIS_PORT')}`,
    };
  }
}
