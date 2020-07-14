import { IPlayer } from './player.model';

export interface ITurn {
  player?: IPlayer;
  valid: boolean;

  setPlayerTurn(player: IPlayer): void;
}

export class Turn implements ITurn {
  player: IPlayer | undefined;

  constructor() {
    this.player = undefined;
  }

  get valid(): boolean {
    return this.player !== undefined && this.player.valid;
  }

  setPlayerTurn(player: IPlayer) {
    this.player = player;
  }
}
