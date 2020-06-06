import { GameCommand } from './game.command';
import { IPlayer } from '../models/player.model';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { AfterTakeCardsEvent } from '../events/after-take-cards.event';
import { AfterYellUnoEvent } from '../events/after-yell-uno.event';
import { LogLevel } from '../log/log-levels.enum';
import { Constants } from '../constants';

/**
 * Class that allows a player to yell Uno
 */
export class YellUnoCommand extends GameCommand {
  private readonly yellerId?: string;

  /**
   * Class that allows a player to yell Uno
   *
   * @param yellerId - identifier of the player who wants to yell Uno
   */
  constructor(yellerId?: string) {
    super();

    this.yellerId = yellerId;
  }

  execute(state: IGameState) {
    const yeller = this.yellerId
      ? state.playersGroup.getPlayerById(this.yellerId)
      : (state.turn.player as IPlayer);

    // es posible que el jugador tenga 2 cartas al momento de gritar UNO!
    state.log(
      `es posible que el jugador tenga 2 cartas al momento de gritar UNO!`,
      LogLevel.ALL,
    );

    if (yeller.hand.cards.length <= 2 && !state.unoYellers[yeller.id]) {
      state.log(
        `si no grito antes entonces lo marca como que grito`,
        LogLevel.ALL,
      );

      // si no grito antes entonces lo marca como que grito
      state.unoYellers[yeller.id] = true;

      state.log(`${yeller.name} gritó UNO`, LogLevel.USER);
      this.events.dispatchAfterYellUno(new AfterYellUnoEvent(yeller));
    } else {
      state.log(
        `si tiene mas de 2 cartas o ya habia gritado entonces debemos validar que no haya mentido`,
        LogLevel.ALL,
      );
      // si tiene mas de 2 cartas o ya habia gritado entonces debemos validar que no haya mentido

      if (yeller.hand.cards.length > 2) {
        const newCards = state.giveCards(
          Constants.PENALITY_FOR_YELL_UNO,
          yeller,
        );

        state.log(
          `${yeller.name} toma dos cartas por cantar UNO cuando no debía`,
          LogLevel.USER,
        );
        this.events.dispatchAfterTakeCards(
          new AfterTakeCardsEvent(newCards, yeller),
        );
      }
    }
  }

  validate(state: IGameState) {
    if (!state.winner) {
      return new CommandValidation(false, 'Runox ya terminó');
    }

    return new CommandValidation(true);
  }
}
