import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { IPlayer } from '../models/player.model';
import { LogLevel } from '../log/log-levels.enum';

/**
 * Class that allows switch hands between two players
 */
export class SwitchHandsCommand extends GameCommand {
  private readonly player1: IPlayer;
  private readonly player2: IPlayer;

  /**
   * Class that allows switch hands between two players
   * @param players1 player one
   * @param players1 player two
   */
  constructor(player1: IPlayer, player2: IPlayer) {
    super();

    this.player1 = player1;
    this.player2 = player2;
  }

  execute(state: IGameState) {
    state.log(`Se han intercambiado dos manos`, LogLevel.USER);

    const cards1 = this.player1.hand.cards;
    const cards2 = this.player2.hand.cards;

    state.log(
      `Cartas de ${this.player1} : ${this.player1.hand.cards.map(
        (x) => x.sprite,
      )}`,
      LogLevel.ALL,
    );
    state.log(
      `Cartas de ${this.player2} : ${this.player2.hand.cards.map(
        (x) => x.sprite,
      )}`,
      LogLevel.ALL,
    );
    
    this.player1.hand.cards = cards2;
    this.player2.hand.cards = cards1;

    state.log(
      `Cartas de ${this.player1} : ${this.player1.hand.cards.map(
        (x) => x.sprite,
      )}`,
      LogLevel.ALL,
    );
    state.log(
      `Cartas de ${this.player2} : ${this.player2.hand.cards.map(
        (x) => x.sprite,
      )}`,
      LogLevel.ALL,
    );
  }

  validate(state: IGameState) {
    if (!this.player1 || !this.player1) {
      return new CommandValidation(
        false,
        'Hubo un inconveniente con los jugadores ingresados',
      );
    }

    return new CommandValidation(true);
  }
}
