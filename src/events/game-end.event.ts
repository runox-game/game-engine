import { IPlayer } from '../models/player.model';

/**
 * Event that fires when the game ends
 */
export class GameEndEvent {
  /**
   * Event that fires when the game ends
   *
   * @param winner - game winner
   * @param score - game winner score
   */
  constructor(public readonly winner: IPlayer, public readonly score: number) {}
}
