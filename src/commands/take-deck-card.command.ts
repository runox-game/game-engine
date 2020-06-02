import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { IPlayer } from '../models/player.model';
import { AfterTakeCardsEvent } from '../events/after-take-cards.event';
import { ICard } from '../models/card.model';
import { LogLevel } from '../log/log-levels.enum';
import { randomizeInteger } from '../utils/random';

/**
 * Class that allows the current player to take a card from the deck
 */
export class TakeDeckCardCommand extends GameCommand {
  /**
   * Class that allows the current player to take a card from the deck
   */
  constructor() {
    super();
  }

  execute(state: IGameState) {
    const currentPlayer = state.turn.player as IPlayer;

    let newCards: ICard[];

    if (state.gameModes.randomTakeDeckCard) {
      newCards = state.giveCards(randomizeInteger(1, 5), currentPlayer);
    } else {
      newCards = state.giveCards(1, currentPlayer);
    }
    state.log(
      `${currentPlayer.name} toma las cartas ${newCards
        .map((x) => x.sprite)
        .join(', ')}`,
      LogLevel.USER,
    );

    this.events.dispatchAfterTakeCards(
      new AfterTakeCardsEvent(newCards, currentPlayer),
    );

    state.unoYellers[currentPlayer.id] = false;

    this.checkForPlayersWhoShouldHaveYelledUno(state);
  }

  validate(state: IGameState) {
    if (!state.winner) {
      return new CommandValidation(false, 'Runox ya terminó');
    }

    if (!state.turn.player) {
      return new CommandValidation(false, 'No se le asigno turno a un jugador');
    }

    return new CommandValidation(true);
  }
}
