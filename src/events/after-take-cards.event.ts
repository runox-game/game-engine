import { ICard } from '../models/card.model';
import { IPlayer } from '../models/player.model';

/**
 * Event that fires after taking a card
 */
export class AfterTakeCardsEvent {
  /**
   * Event that fires after taking a card
   *
   * @param cards - cards that were taken
   * @param player - player who took the cards
   */
  constructor(public readonly cards: ICard[], public readonly player: IPlayer) {}
}
