import { Player } from './player.model';

export class Turn {
  player: Player | undefined;

  constructor() {
    this.player = undefined;
  }

  setPlayerTurn(player: Player) {
    this.player = player;
  }
}
