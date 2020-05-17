import { IGameState, GameState } from './models/game-state.model';
import { IPlayer } from './models/player.model';
import { GameEvents } from './events/game-events';
import { GameEvent } from './events/game-event.enum';
import { CommandService } from './commands/command.service';
import { ICard } from './models/card.model';
import { GameModes } from './models/game-modes';

export class GameEngine {
  private readonly state: IGameState;
  private readonly commandService: CommandService;
  private readonly gameEvents: GameEvents;

  constructor() {
    this.state = new GameState();
    this.commandService = new CommandService();
    this.gameEvents = GameEvents.getInstance();
  }

  get events() {
    return {
      [GameEvent.AFTER_GAME_START]: this.gameEvents.afterGameStart$,
      [GameEvent.AFTER_PLAY_CARD]: this.gameEvents.afterPlayCard$,
      [GameEvent.AFTER_TAKE_CARDS]: this.gameEvents.afterTakeCards$,
      [GameEvent.AFTER_YELL_UNO]: this.gameEvents.afterYellUno$,
      [GameEvent.BEFORE_TURN]: this.gameEvents.beforeTurn$,
      [GameEvent.GAME_END]: this.gameEvents.gameEnd$,
    };
  }

  get players() {
    return this.state.playersGroup.players;
  }

  get playerTurn() {
    return this.state.turn.player;
  }

  get stackCard() {
    return this.state.stack.cardOnTop;
  }

  get modes() {
    return this.state.gameModes;
  }

  get gameStateAsJSON() {
    return {
      id: this.state.id,
      deck: this.state.deck,
      stack: this.state.stack,
      playersGroup: this.state.playersGroup,
      turn: this.state.turn,
      unoYellers: this.state.unoYellers,
      gameDirection: this.state.gameDirection,
      cardsToGive: this.state.cardsToGive,
      gameModes: this.state.gameModes,
    } as IGameState;
  }

  start(gameModes?: GameModes) {
    return this.commandService.startGame(this.state, gameModes);
  }

  join(players: IPlayer[]) {
    return this.commandService.addPlayers(this.state, players);
  }

  playCard(playerId: string, card: ICard, toPlayerId?: string) {
    return this.commandService.playCard(this.state, playerId, card, toPlayerId);
  }

  takeCard() {
    return this.commandService.takeCard(this.state);
  }

  uno(yellerId?: string) {
    return this.commandService.yellUno(this.state, yellerId);
  }

  overrideInternalState(externalState: IGameState) {
    this.state.overrideInternalState(externalState);
  }
}
