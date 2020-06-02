import { IPlayer } from './player.model';

export interface IPlayersGroup {
  players: IPlayer[];

  addPlayer(player: IPlayer): void;
  addPlayers(players: IPlayer[]): void;
  removePlayer(player: IPlayer): void;
  getPlayerById(playerId: string): IPlayer;
  shufflePlayers(): void;
}

export class PlayersGroup implements IPlayersGroup {
  players: IPlayer[];

  constructor() {
    this.players = [];
  }

  addPlayer(player: IPlayer): void {
    this.players.push(player);
  }

  addPlayers(players: IPlayer[]): void {
    this.players.push(...players);
  }

  removePlayer(player: IPlayer): void {
    this.players = this.players.filter((x) => x.id === player.id);
  }

  /**
   * Randomize order of players
   */
  shufflePlayers(): void {
    this.players.sort(() => Math.random() - 0.5);
  }

  /**
   * Find Player by id
   * @param playerId
   */
  getPlayerById(playerId: string): IPlayer {
    const player = this.players.find((player) => player.id === playerId);

    if (!player) {
      throw new Error(
        `El jugador con id ${playerId} no esta en el grupo de jugadores`,
      );
    }

    return player;
  }
}
