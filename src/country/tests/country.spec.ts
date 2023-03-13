import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { CountryService } from '../country.service';
import { CountryController } from '../country.controller';

describe('Country tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [CountryService],
      controllers: [CountryController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET countries`, () => {
    return request(app.getHttpServer()).get('/country').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
