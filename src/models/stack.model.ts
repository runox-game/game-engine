import { Card, ICard } from './card.model';

export interface IStack {
  cards: ICard[];

  readonly cardOnTop?: ICard;

  addCard(card: ICard): void;
  empty(): void;
}

export class Stack implements IStack {
  cards: ICard[];

  constructor() {
    this.cards = [];
  }

  get cardOnTop() {
    if (!this.cards.length) {
      return undefined;
    }

    return this.cards[0];
  }

  addCard(card: ICard) {
    if (!card) {
      throw new Error(
        'La carta ha llegado nula al intentar agregarla al stack',
      );
    }

    this.cards.unshift(card);
  }

  empty() {
    this.cards.splice(0, this.cards.length);
  }
}
