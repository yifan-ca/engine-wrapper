import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(({ body }) => expect(body.status).toBeDefined())
      .expect(({ body }) => expect(body.details).toBeDefined())
      .expect(({ body }) => expect(body.details.engine).toBeDefined())
      .expect(({ body }) => expect(body.details.memory_heap).toBeDefined())
      .expect(({ body }) => expect(body.details.memory_rss).toBeDefined())
      .expect(({ body }) => expect(body.details.disk).toBeDefined());
  });

  afterAll(async () => {
    await app.close();
  });
});
