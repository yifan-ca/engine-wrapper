import { Engine, SearchResult } from 'node-uci';

import { Injectable } from '@nestjs/common';

export interface MoveOptions {
  position: string;
  movetime: number;
  moves: string[];
}

@Injectable()
export class EngineService {
  constructor(private readonly engine: Engine) {}

  /**
   * Universal Chess Interface (UCI)
   *
   * ucinewgame
   *  this is sent to the engine when the next search (started with "position" and "go") will be from
   *  a different game.
   *
   * position [fen  | startpos ]  moves  ....
   *  set up the position described in fenstring on the internal board and
   *  play the moves on the internal chess board.
   *
   * go
   *  start calculating on the current position set up with the "position" command.
   *
   * movetime
   *  search exactly x mseconds
   *
   * Reference: http://wbec-ridderkerk.nl/html/UCIProtocol.html
   *
   * @param {string} position position described in fenstring
   * @param {number} [movetime] milliseconds to search
   * @param {string[]} [moves] moves to current position in long algebraic notation format
   * @return {*}  {Promise<SearchResult>} bestmove and info from engine
   * @memberof EngineService
   */
  async move(options: MoveOptions): Promise<SearchResult> {
    return this.engine
      .chain()
      .ucinewgame()
      .position(options.position, options.moves)
      .go({ movetime: options.movetime });
  }

  /**
   * Universal Chess Interface (UCI)
   *
   * the engine should wait for the "isready"
   *
   * isready
   *  this is used to synchronize the engine with the GUI
   *
   * Reference: http://wbec-ridderkerk.nl/html/UCIProtocol.html
   *
   * @return {*}  {Promise<Engine>}
   * @memberof EngineService
   */
  async ready(): Promise<Engine> {
    return await this.engine.isready();
  }
}
