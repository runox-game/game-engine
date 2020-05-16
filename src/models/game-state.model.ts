import { Deck, IDeck } from './deck.model';
import { PlayersGroup, IPlayersGroup } from './players-group.model';
import { Turn, ITurn } from './turn.model';
import { Stack, IStack } from './stack.model';
import { GameDirection } from './game-direction.model';
import { Card, ICard } from './card.model';
import { Player, IPlayer } from './player.model';
import { GameEvents } from '../events/game-events';
import { Value } from './values.model';
import { GameModes } from './game-modes';
import { Color } from './color.model';

export interface IGameState {
  id: number;
  readonly deck: IDeck;
  readonly stack: IStack;
  readonly playersGroup: IPlayersGroup;
  readonly turn: ITurn;
  readonly events: GameEvents;
  unoYellers: { [id: string]: boolean };
  gameDirection: number;
  cardsToGive: number;
  gameModes: GameModes;

  readonly nextPlayerToPlay: IPlayer;

  changeDirection(): void;
  giveCards(quantity: number, toPlayer: IPlayer): ICard[];
  addStackCardsToDeck(): void;
  overrideInternalState(state: IGameState): void;
}

/** Clase que representa el estado del juego */
export class GameState implements IGameState {
  readonly deck: IDeck;
  readonly stack: IStack;
  readonly playersGroup: IPlayersGroup;
  readonly turn: Turn;
  readonly events: GameEvents;

  gameDirection: GameDirection;
  cardsToGive: number;
  unoYellers: { [id: string]: boolean };
  id: number;
  gameModes: GameModes;

  constructor() {
    this.id = new Date().getTime();
    this.deck = new Deck();
    this.stack = new Stack();
    this.playersGroup = new PlayersGroup();
    this.turn = new Turn();
    this.events = GameEvents.getInstance();

    this.gameDirection = GameDirection.CLOCKWISE;
    this.cardsToGive = 0;
    this.unoYellers = {};
    this.gameModes = {
      randomTakeDeckCard: false,
    };
  }

  get nextPlayerToPlay() {
    // es el primer turno, entonces elegimos el primer jugador
    if (!this.turn.player) {
      return this.playersGroup.players[0];
    }

    const currentPlayerIndex = this.playersGroup.players.findIndex(
      (player) => player.id === this.turn.player?.id,
    );

    const nextPlayerIndex = currentPlayerIndex + 1;

    // no ha terminado la vuelta, entonces elegimos el proximo en la lista
    if (nextPlayerIndex < this.playersGroup.players.length) {
      return this.playersGroup.players[nextPlayerIndex];
    }

    // ya ha jugado el ultimo, entonces comienza nuevamente desde el primero
    return this.playersGroup.players[0];
  }

  changeDirection() {
    const newDirection =
      this.gameDirection === GameDirection.CLOCKWISE
        ? GameDirection.COUNTER_CLOCKWISE
        : GameDirection.CLOCKWISE;

    this.gameDirection = newDirection;

    this.playersGroup.players.reverse();
  }

  giveCards(quantity: number, toPlayer: IPlayer) {
    // numero de cartas disponibles entre mazo y pila
    const availableCards =
      this.deck.cards.length + (this.stack.cards.length - 1);

    while (quantity > availableCards) {
      throw new Error('No se puede dar más cartas que las jugables');
    }

    if (quantity > this.deck.cards.length) {
      this.addStackCardsToDeck();
    }

    let newCards: ICard[] = [];

    for (let index = 0; index < quantity; index++) {
      newCards = [...newCards, this.deck.takeCard() as Card];
    }

    toPlayer.hand.addCards(newCards);

    return newCards;
  }

  addStackCardsToDeck() {
    const newDeckCards = this.stack.cards.filter(
      (card) => card.id === this.stack.cardOnTop?.id,
    );

    this.deck.addCards(newDeckCards);

    const cardOnTopTheStack = this.stack.cardOnTop;

    if (!cardOnTopTheStack) {
      throw new Error('No se pudo obtener la carta de la cima del stack');
    }

    this.stack.empty();

    this.stack.addCard(cardOnTopTheStack);

    this.deck.shuffle();
  }

  overrideInternalState(state: IGameState) {
    this.id = state.id;

    this.deck.cards = state.deck.cards.map((card: ICard) => {
      return new Card(card.value, card.color, card.id);
    });

    this.stack.cards = state.stack.cards.map((card: ICard) => {
      if (card.value === Value.PLUS_FOUR || card.value === Value.WILDCARD) {
        const specialCard = new Card(card.value, undefined, card.id);

        specialCard.setColor(card.color as Color);

        return specialCard;
      }

      return new Card(card.value, card.color, card.id);
    });

    this.playersGroup.players = state.playersGroup.players.map(
      (player: IPlayer) => {
        const pl = new Player(player.id, player.name, player.pic);

        pl.hand.cards = player.hand.cards.map((card: ICard) => {
          return new Card(card.value, card.color, card.id);
        });

        return pl;
      },
    );

    this.turn.player = state.turn.player
      ? (this.playersGroup.players.find(
          (player) => player.id === state.turn.player?.id,
        ) as IPlayer)
      : undefined;

    this.unoYellers = state.unoYellers;
    this.gameDirection = state.gameDirection;
    this.cardsToGive = state.cardsToGive;
    this.gameModes = state.gameModes;
  }
}
