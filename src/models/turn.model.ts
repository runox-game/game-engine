import { IPlayer } from './player.model';

export interface ITurn {
  player?: IPlayer;

  setPlayerTurn(player: IPlayer): void;
}

export class Turn implements ITurn {
  player: IPlayer | undefined;

  constructor() {
    this.player = undefined;
  }

  setPlayerTurn(player: IPlayer) {
    this.player = player;
  }
}
