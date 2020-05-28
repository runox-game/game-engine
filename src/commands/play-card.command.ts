import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { Value } from '../models/values.model';
import { CommandValidation } from './command-result';
import { AfterPlayCardEvent } from '../events/after-play-card.event';
import { ICard, Card } from '../models/card.model';
import { GameEndEvent } from '../events/game-end.event';
import { AfterTakeCardsEvent } from '../events/after-take-cards.event';
import { ReverseEvent } from '../events/reverse.event';
import { SkipEvent } from '../events/skip.event';
import { LogLevel } from '../log/log-levels.enum';
import { GameDirection } from '../models/game-direction.model';

/**
 * Class that allows a player to play a card from his hand
 */
export class PlayCardCommand extends GameCommand {
  private readonly playerId: string;
  private readonly card: ICard;
  private readonly toPlayerId?: string;

  /**
   * Class that allows a player to play a card from his hand
   *
   * @param playerId - identifier of the player who wants to play a card
   * @param card - card to be played
   * @param toPlayerId - identifier of the player who will receive the card
   */
  constructor(playerId: string, card: ICard, toPlayerId?: string) {
    super();

    this.playerId = playerId;
    this.card =
      card instanceof Card ? card : new Card(card.value, card.color, card.id);
    this.toPlayerId = toPlayerId;
  }

  execute(state: IGameState) {
    state.turn.player?.hand.removeCard(this.card);

    state.stack.addCard(this.card);
    state.log(
      ` ${state.turn.player?.name} juega la carta ${this.card}`,
      LogLevel.USER,
    );

    if (
      state.turn.player?.hand.cards.length === 0 &&
      state.unoYellers[state.turn.player?.id]
    ) {
      const score = state.playersGroup.players
        .filter((player) => player.id !== state.turn.player?.id)
        .reduce((score, player) => {
          score += player.hand.score;

          return score;
        }, 0);

      state.setWinner(state.turn.player, score);
      state.log(
        ` ${state.turn.player} es el ganador con score:${score}`,
        LogLevel.ALL,
      );

      this.events.dispatchGameEnd(new GameEndEvent(state.turn.player, score));
    }

    this.checkForPlayersWhoShouldHaveYelledUno(state);

    if (state.stack.cardOnTop?.value === Value.PLUS_FOUR) {
      state.log(` La carta jugada es un +4`, LogLevel.USER);
      if (!state.gameModes.dedicatePlusFour) {
        state.log(
          ` Es importante el orden en que se aplica los efectos.`,
          LogLevel.ALL,
        );
        state.log(` Primero se aplica +4 y luego saltea turno.`, LogLevel.ALL);
        // Es importante el orden en que se aplica los efectos.
        // Primero se aplica +4 y luego saltea turno.
        const newCards = state.giveCards(4, state.nextPlayerToPlay);

        state.log(
          ` Es un +4, ${state.nextPlayerToPlay} toma las cartas ${newCards.map(
            (x) => x.sprite,
          )}`,
          LogLevel.ALL,
        );
        state.log(
          ` Es un +4, ${state.nextPlayerToPlay} toma 4 cartas`,
          LogLevel.USER,
        );
        this.events.dispatchAfterTakeCards(
          new AfterTakeCardsEvent(newCards, state.nextPlayerToPlay),
        );

        state.turn.setPlayerTurn(state.nextPlayerToPlay);
      } else {
        state.log(` Se está jugando con +4s`, LogLevel.USER);
        const toPlayer = state.playersGroup.getPlayerById(
          this.toPlayerId as string,
        );

        const newCards = state.giveCards(4, toPlayer);

        state.log(` Es un +4, ${toPlayer} toma 4 cartas`, LogLevel.USER);

        this.events.dispatchAfterTakeCards(
          new AfterTakeCardsEvent(newCards, toPlayer),
        );
      }
    }

    if (state.stack.cardOnTop?.value === Value.PLUS_TWO) {
      state.log(` La carta jugada es un +2`, LogLevel.USER);
      state.cardsToGive += 2;

      const nextPlayerHasPlusTwo = state.nextPlayerToPlay.hand.hasCard(
        Value.PLUS_TWO,
      );

      if (!nextPlayerHasPlusTwo) {
        state.log(` El siguiente jugador no tiene +2`, LogLevel.ALL);
        state.log(
          ` ${state.nextPlayerToPlay} debe tomar 2 cartas`,
          LogLevel.USER,
        );
        const newCards = state.giveCards(
          state.cardsToGive,
          state.nextPlayerToPlay,
        );

        this.events.dispatchAfterTakeCards(
          new AfterTakeCardsEvent(newCards, state.nextPlayerToPlay),
        );

        state.cardsToGive = 0;

        state.turn.setPlayerTurn(state.nextPlayerToPlay);
      }
    }

    if (state.stack.cardOnTop?.value === Value.SKIP) {
      state.log(` La carta jugada es un Salto`, LogLevel.USER);
      state.log(` Se saltea a ${state.nextPlayerToPlay}`, LogLevel.USER);
      state.turn.setPlayerTurn(state.nextPlayerToPlay);
      this.events.dispatchSkip(new SkipEvent(state.nextPlayerToPlay));
    }

    if (state.stack.cardOnTop?.value === Value.REVERSE) {
      state.log(
        ` La carta jugada inverte el sentido de la vuelta`,
        LogLevel.USER,
      );
      state.log(
        ` Cambia de dirección a ${
          state.gameDirection == GameDirection.CLOCKWISE
            ? GameDirection.COUNTER_CLOCKWISE
            : GameDirection.CLOCKWISE
        }`,
        LogLevel.ALL,
      );
      state.changeDirection();

      if (state.playersGroup.players.length === 2) {
        state.log(
          ` si son dos jugadores entonces funciona como SKIP`,
          LogLevel.ALL,
        );
        // si son dos jugadores entonces funciona como SKIP
        state.log(` Se saltea a ${state.nextPlayerToPlay}`, LogLevel.USER);
        state.turn.setPlayerTurn(state.nextPlayerToPlay);
      }
      this.events.dispatchReverse(new ReverseEvent(state.nextPlayerToPlay));
    }

    const player = state.playersGroup.getPlayerById(this.playerId);

    this.events.dispatchAfterPlayCard(
      new AfterPlayCardEvent(this.card, player),
    );
  }

  private checkForPlayersWhoShouldHaveYelledUno(state: IGameState) {
    const playersWhoShouldHaveYelled = state.playersGroup.players.filter(
      (player) =>
        player.id !== state.turn.player?.id &&
        player.hand.cards.length === 1 &&
        !state.unoYellers[player.id],
    );

    state.log(
      `${playersWhoShouldHaveYelled
        .map((x) => x.name)
        .join(', ')} deberían haber cantado UNO`,
      LogLevel.ALL,
    );
    playersWhoShouldHaveYelled.forEach((player) => {
      const newCards = state.giveCards(2, player);
      state.log(`${player.name} toma dos cartas`, LogLevel.ALL);

      this.events.dispatchAfterTakeCards(
        new AfterTakeCardsEvent(newCards, player),
      );
    });
  }

  validate(state: IGameState) {
    if (state.winner) {
      return new CommandValidation(false, 'Runox ya terminó');
    }

    const player = state.playersGroup.getPlayerById(this.playerId);

    if (!player) {
      return new CommandValidation(
        false,
        'No ha sido posible encontrar al jugador en la partida',
      );
    }

    if (!state.turn.player) {
      return new CommandValidation(false, 'No hay un turno activo');
    }

    if (player.id !== state.turn.player.id) {
      return new CommandValidation(false, 'No es el turno del jugador');
    }

    if (!this.card) {
      return new CommandValidation(
        false,
        'No se ha encontrado la carta de la mano del jugador',
      );
    }

    const playerHasSelectedCard = player.hand.cards.some(
      (card) => card.id === this.card.id,
    );

    if (!playerHasSelectedCard) {
      return new CommandValidation(
        false,
        'El jugador no posee la carta seleccionada',
      );
    }

    if (
      (this.card?.value === Value.WILDCARD ||
        this.card?.value === Value.PLUS_FOUR) &&
      !this.card.color
    ) {
      return new CommandValidation(
        false,
        'No se especifico el color de la carta',
      );
    }

    if (
      state.stack.cardOnTop?.value === Value.PLUS_TWO &&
      this.card.value !== Value.PLUS_TWO &&
      state.cardsToGive > 0
    ) {
      return new CommandValidation(false, 'La carta que quiere tirar no es +2');
    }
    if (
      state.stack.cardOnTop &&
      !this.card?.isPlayable(state.stack.cardOnTop)
    ) {
      return new CommandValidation(
        false,
        'La carta que quiere tirar no tiene el mismo color o valor que la del stack',
      );
    }

    if (
      state.gameModes.dedicatePlusFour &&
      this.card.value === Value.PLUS_FOUR &&
      !this.toPlayerId
    ) {
      return new CommandValidation(
        false,
        'Debe ingresar el identificador del jugador al que se le dedica el +4',
      );
    }

    if (
      state.gameModes.dedicatePlusFour &&
      this.card.value === Value.PLUS_FOUR &&
      this.toPlayerId
    ) {
      const toPlayer = state.playersGroup.getPlayerById(this.toPlayerId);

      if (!toPlayer) {
        return new CommandValidation(
          false,
          `No se encontro el jugador con id: ${this.toPlayerId}`,
        );
      }
    }

    return new CommandValidation(true);
  }
}
