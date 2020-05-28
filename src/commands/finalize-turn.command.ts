import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { BeforeTurnEvent } from '../events/before-turn.event';
import { LogLevel } from '../log/log-levels.enum';

/**
 * Class that allows the end of the current player's turn and select the next one
 */
export class FinalizeTurnCommand extends GameCommand {
  /**
   * Class that allows the end of the current player's turn and select the next one
   */
  constructor() {
    super();
  }

  execute(state: IGameState) {
    const nextPlayer = state.nextPlayerToPlay;
    
    state.logMessage(`${state.nextPlayerToPlay.name} finaliza y continúa ${nextPlayer.name}`, LogLevel.USER);
    state.turn.setPlayerTurn(nextPlayer);

    this.events.dispatchBeforeTurn(new BeforeTurnEvent(nextPlayer));
  }

  validate(state: IGameState) {
    if (!state.playersGroup.players.length) {
      return new CommandValidation(
        false,
        'No se puede finalizar el turno si no hay jugadores',
      );
    }

    return new CommandValidation(true);
  }
}
