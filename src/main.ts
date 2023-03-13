import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import SwaggerConfig from './config/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  /**
   * Creates an instance of NestApplication.
   */
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /**
   * Connect microservice to the NestApplication instance.
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'celica_organizer_service',
        brokers: [
          `${configService.get<string>(
            'KAFKA_HOST',
          )}:${configService.get<string>('KAFKA_PORT')}`,
        ],
      },
      consumer: {
        groupId: 'celica_organizer_consumer',
      },
    },
  });

  /**
   * Swagger documentation configuration
   */
  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document);

  /**
   * Enabling validation pipes globally
   */
  app.useGlobalPipes(new ValidationPipe());

  // await app.startAllMicroservices();

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
