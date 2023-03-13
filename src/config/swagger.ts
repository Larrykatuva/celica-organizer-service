import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger configuration settings.
 */
const config = new DocumentBuilder()
  .setTitle('ORGANIZER SERVICE')
  .setDescription('Celica organizer service API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
export default config;
