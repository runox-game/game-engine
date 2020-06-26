import { GameCommand } from './game.command';
import { IPlayer } from '../models/player.model';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { LogLevel } from '../log/log-levels.enum';

/**
 * Players to remove a player from the game
 */
export class RemovePlayerCommand extends GameCommand {
  /**
   * Player to remove from the game
   */
  private readonly player: IPlayer;

  /**
   * Class that allows removing a player to remove from the game state
   *
   * @param players - player to remove from the game
   */
  constructor(player: IPlayer) {
    super();

    this.player = player;
  }

  execute(state: IGameState) {
    state.log(`Jugadores: ${this.player}`, LogLevel.USER);
    state.playersGroup.removePlayer(this.player);

    state.events.dispatchStateChanged(state);
  }

  validate(state: IGameState) {
    if (!this.player) {
      return new CommandValidation(
        false,
        'Hubo un inconveniente con los jugadores a remover',
      );
    }

    return new CommandValidation(true);
  }
}
