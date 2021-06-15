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

  it('chess:opening', (done) => {
    request(app.getHttpServer())
      .post('/engine')
      .send({
        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        movetime: 500,
        moves: [],
      })
      .expect(200, (err, res) => {
        if (err) {
          done(err);
        }
        const { bestmove } = res.body;
        expect(bestmove.length).not.toEqual(0);
        done();
      });
  });

  it('chess:endgame', () => {
    return request(app.getHttpServer())
      .post('/engine')
      .send({
        position: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
        movetime: 500,
        moves: ["e2e4", "e7e5", "d4h5", "b8c6", "f1c4", "g8f6", "h5f7"],
      })
      .expect(500);
  });

  afterAll(async () => {
    await app.close();
  });
});
