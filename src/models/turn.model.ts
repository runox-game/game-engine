import { IPlayer } from './player.model';

export interface ITurn {
  player?: IPlayer;
  valid: boolean;
  round: number;

  setPlayerTurn(player: IPlayer): void;
}

export class Turn implements ITurn {
  player: IPlayer | undefined;
  round: number = 0;

  constructor() {
    this.player = undefined;
  }

  get valid(): boolean {
    return this.player !== undefined && this.player.valid;
  }

  setPlayerTurn(player: IPlayer) {
    if (this.player?.id !== player.id) {
      this.round++;
    }
    this.player = player;
  }
}
