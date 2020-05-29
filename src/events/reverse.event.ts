import { IPlayer } from "../models/player.model";

/**
 * Event that fires when the direction is changed by revert card
 */
export class ReverseEvent {
  /**
   * Event that fires when the direction is changed by revert card
   *
   * @param player Next player
   */
  constructor(public readonly player: IPlayer) {}
}
