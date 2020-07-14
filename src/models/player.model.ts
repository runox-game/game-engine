import { Hand, IHand } from './hand.model';

export interface IPlayer {
  valid: boolean;
  readonly id: string;
  readonly name: string;
  readonly pic: string;
  readonly hand: IHand;
}

export class Player implements IPlayer {
  readonly id: string;
  readonly name: string;
  readonly pic: string;
  readonly hand: IHand;

  constructor(id: string, name: string, pic: string) {
    this.id = id;
    this.name = name;
    this.pic = pic;

    this.hand = new Hand();
  }

  get valid(): boolean {
    return (
      this.id !== undefined &&
      this.name !== undefined &&
      this.pic !== undefined &&
      this.hand !== undefined &&
      this.hand.valid
    );
  }
}
