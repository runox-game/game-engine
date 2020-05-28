import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { IPlayer } from '../models/player.model';
import { AfterTakeCardsEvent } from '../events/after-take-cards.event';
import { ICard } from '../models/card.model';

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
      newCards = state.giveCards(this.randomizeInteger(1, 5), currentPlayer);
    } else {
      newCards = state.giveCards(1, currentPlayer);
    }

    this.events.dispatchAfterTakeCards(
      new AfterTakeCardsEvent(newCards, currentPlayer),
    );

    state.unoYellers[currentPlayer.id] = false;

    this.checkForPlayersWhoShouldHaveYelledUno(state);
  }

  private checkForPlayersWhoShouldHaveYelledUno(state: IGameState) {
    const playersWhoShouldHaveYelled = state.playersGroup.players.filter(
      (player) =>
        player.id !== state.turn.player?.id &&
        player.hand.cards.length === 1 &&
        !state.unoYellers[player.id],
    );

    playersWhoShouldHaveYelled.forEach((player) => {
      const newCards = state.giveCards(2, player);

      this.events.dispatchAfterTakeCards(
        new AfterTakeCardsEvent(newCards, player),
      );
    });
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

  private randomizeInteger(min: number, max: number) {
    if (max === null) {
      max = min === null ? Number.MAX_SAFE_INTEGER : min;
      min = 1;
    }

    min = Math.ceil(min); // inclusive min
    max = Math.floor(max); // exclusive max

    if (min > max - 1) {
      throw new Error('Incorrect arguments.');
    }

    return min + Math.floor((max - min) * Math.random());
  }
}
