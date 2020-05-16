import { GameCommand } from './game.command';
import { IPlayer } from '../models/player.model';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';

/**
 * Players to add into the game
 */
export class AddPlayersCommand extends GameCommand {
  /**
   * Players to add into the game
   */
  private readonly players: IPlayer[];

  /**
   * Class that allows adding players to the game state
   *
   * @param players - players to add into the game
   */
  constructor(players: IPlayer[]) {
    super();

    this.players = players;
  }

  execute(state: IGameState) {
    state.playersGroup.addPlayers(this.players);
  }

  validate(state: IGameState) {
    if (!this.players || !this.players.length) {
      return new CommandValidation(
        false,
        'Hubo un inconveniente con los jugadores ingresados',
      );
    }

    return new CommandValidation(true);
  }
}
