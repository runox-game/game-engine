import { IPlayer } from './player.model';

export interface IPlayersGroup {
  players: IPlayer[];

  addPlayer(player: IPlayer): void;
  addPlayers(players: IPlayer[]): void;
  getPlayerById(playerId: string): IPlayer;
}

export class PlayersGroup implements IPlayersGroup {
  players: IPlayer[];

  constructor() {
    this.players = [];
  }

  addPlayer(player: IPlayer) {
    this.players.push(player);
  }

  addPlayers(players: IPlayer[]) {
    this.players.push(...players);
  }

  getPlayerById(playerId: string) {
    const player = this.players.find((player) => player.id === playerId);

    if (!player) {
      throw new Error(
        `El jugador con id ${playerId} no esta en el grupo de jugadores`,
      );
    }

    return player;
  }
}
