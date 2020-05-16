import { ICard } from './card.model';

export interface IDeck {
  cards: ICard[];

  addCards(cards: ICard[]): void;
  shuffle(): void;
  takeCard(): ICard;
}

export class Deck implements IDeck {
  cards: ICard[];

  constructor() {
    this.cards = [];
  }

  addCards(cards: ICard[]) {
    this.cards.push(...cards);
  }

  shuffle() {
    let index = this.cards.length,
      temporaryValue,
      randomIndex;

    // mientras queden elementos a mezclar
    while (0 !== index) {
      // seleccionar un elemento sin mezclar
      randomIndex = Math.floor(Math.random() * index);
      index -= 1;

      // e intercambiarlo con el elemento actual
      temporaryValue = this.cards[index];
      this.cards[index] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  takeCard() {
    if (!this.cards.length) {
      throw new Error('No hay cartas disponibles en el mazo');
    }

    const card = this.cards.shift();

    if (!card) {
      throw new Error('No ha sido posible tomar cartas del mazo');
    }

    return card;
  }
}
