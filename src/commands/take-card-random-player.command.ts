import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { IPlayer } from '../models/player.model';
import { AfterTakeCardsEvent } from '../events/after-take-cards.event';
import { ICard } from '../models/card.model';
import { LogLevel } from '../log/log-levels.enum';
import { randomizeInteger } from '../utils/random';

/**
 * Class that allows a random player to take a card from the deck
 */
export class TakeCardRandomPlayerCommand extends GameCommand {
  /**
   * Class that allows a random player to take a card from the deck
   */
  constructor() {
    super();
  }

  execute(state: IGameState) {
    const randomIndex = randomizeInteger(0, state.playersGroup.players.length);

    const randomPlayer = state.playersGroup.players[randomIndex] as IPlayer;

    let newCards: ICard[];

    if (state.gameModes.randomTakeDeckCard) {
      newCards = state.giveCards(randomizeInteger(1, 5), randomPlayer);
    } else {
      newCards = state.giveCards(1, randomPlayer);
    }
    state.log(
      `${randomPlayer.name} toma por sorpresa las cartas ${newCards
        .map((x) => x.sprite)
        .join(', ')}`,
      LogLevel.USER,
    );

    this.events.dispatchAfterTakeCards(
      new AfterTakeCardsEvent(newCards, randomPlayer),
    );

    state.unoYellers[randomPlayer.id] = false;

    this.checkForPlayersWhoShouldHaveYelledUno(state);
  }

  validate(state: IGameState) {
    if (!state.gameModes.crazyCommands) {
      return new CommandValidation(false, 'Modo Crazy no está permitido');
    }

    if (!!state.winner) {
      return new CommandValidation(false, 'Runox ya terminó');
    }

    return new CommandValidation(true);
  }
}
