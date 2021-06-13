import { Engine, EngineChain } from 'node-uci';

import { EngineService } from './engine.service';
import { Test } from '@nestjs/testing';
import { throws } from 'assert';

describe('EngineService', () => {
  let engineService: EngineService;
  let engine: Engine;
  let engineChain: EngineChain;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: Engine,
          useValue: {
            chain: jest.fn(),
            isready: jest.fn(),
          },
        },
        {
          provide: EngineChain,
          useValue: {
            ucinewgame: jest.fn(),
            position: jest.fn(),
            go: jest.fn(),
          },
        },
        EngineService,
      ],
    }).compile();

    engineChain = moduleRef.get<EngineChain>(EngineChain);
    engine = moduleRef.get<Engine>(Engine);
    engineService = moduleRef.get<EngineService>(EngineService);
  });

  describe('move', () => {
    it('should return a search result if success', () => {
      // arrange
      jest.spyOn(engine, 'chain').mockImplementationOnce(() => engineChain);
      jest
        .spyOn(engineChain, 'ucinewgame')
        .mockImplementationOnce(() => engineChain);
      const spyengineChainPosition = jest
        .spyOn(engineChain, 'position')
        .mockImplementationOnce(() => engineChain);
      const spyengineChainGo = jest
        .spyOn(engineChain, 'go')
        .mockResolvedValueOnce({ bestmove: 'move', info: ['info'] });
      // act
      const actual = expect(
        engineService.move({
          position: 'position',
          moves: ['history'],
          movetime: 5000,
        }),
      );
      // assert
      expect(spyengineChainPosition).toBeCalledWith('position', ['history']);
      expect(spyengineChainGo).toBeCalledWith({ movetime: 5000 });
      return actual.resolves.toEqual({ bestmove: 'move', info: ['info'] });
    });
    it('should raise an error if engine fail', () => {
      // arrange
      jest.spyOn(engine, 'chain').mockImplementationOnce(() => engineChain);
      jest
        .spyOn(engineChain, 'ucinewgame')
        .mockImplementationOnce(() => engineChain);
      jest
        .spyOn(engineChain, 'position')
        .mockImplementationOnce(() => engineChain);
      jest
        .spyOn(engineChain, 'go')
        .mockRejectedValueOnce(new Error('engine error'));
      // act
      const actual = expect(
        engineService.move({
          position: 'position',
          moves: ['history'],
          movetime: 5000,
        }),
      );
      // assert
      return actual.rejects.toThrowError(new Error('engine error'));
    });
  });

  describe('ready', () => {
    it('should return success when engine is ready', () => {
      // arrange
      jest.spyOn(engine, 'isready').mockResolvedValueOnce(engine);
      // act
      const actual = expect(
        engineService.ready(),
      );
      // assert
      return actual.resolves.toEqual(engine);
    });
    it('should raise an error if engine is not ready', () => {
      // arrange
      jest.spyOn(engine, 'isready').mockRejectedValueOnce(new Error('engine error'));
      // act
      const actual = expect(
        engineService.ready(),
      );
      // assert
      return actual.rejects.toThrowError(new Error('engine error'));
    });
  });
});
