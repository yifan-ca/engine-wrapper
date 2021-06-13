import { EngineHealthIndicator } from './engine.health';
import { EngineService } from './engine.service';
import { Test } from '@nestjs/testing';

describe('EngineHealthIndicator', () => {
  let engineHealthIndicator: EngineHealthIndicator;
  let engineService: EngineService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: EngineService,
          useValue: {
            ready: jest.fn(),
          },
        },
        EngineHealthIndicator,
      ],
    }).compile();

    engineService = moduleRef.get<EngineService>(EngineService);
    engineHealthIndicator = moduleRef.get<EngineHealthIndicator>(
      EngineHealthIndicator,
    );
  });

  describe('checkReady', () => {
    it('should return success when engine is ready', () => {
      // arrange
      const engineServiceSpy = jest
        .spyOn(engineService, 'ready')
        .mockResolvedValueOnce(null);
      // act
      const actual = expect(engineHealthIndicator.checkReady('engine'));
      // assert
      expect(engineServiceSpy).toBeCalled();
      return actual.resolves.toEqual({ engine: { status: 'up' } });
    });

    it('should return failure when engine is not ready', () => {
      // arrange
      const engineServiceSpy = jest
        .spyOn(engineService, 'ready')
        .mockRejectedValueOnce(new Error('service error'));
      // act
      const actual = expect(engineHealthIndicator.checkReady('engine'));
      // assert
      expect(engineServiceSpy).toBeCalled();
      return actual.rejects.toThrowError(new Error('service error'));
    });
  });
});
