import { IGameState, GameState } from './models/game-state.model';
import { IPlayer } from './models/player.model';
import { GameEvents } from './events/game-events';
import { GameEvent } from './events/game-event.enum';
import { CommandService } from './commands/command.service';
import { ICard } from './models/card.model';
import { GameModes } from './models/game-modes';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ILog } from './log/log.factory';
import { LogLevel } from './log/log-levels.enum';

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
      [GameEvent.CHANGE_COLOR]: this.gameEvents.changeColor$,
      [GameEvent.SKIP]: this.gameEvents.skip$,
      [GameEvent.REVERSE]: this.gameEvents.reverse$,
      [GameEvent.ERROR]: this.gameEvents.error$,
      [GameEvent.SPECIAL_CARD]: this.gameEvents.specialCard$,
      [GameEvent.STATE_CHANGED]: this.gameEvents.stateChanged$,
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

  start(gameModes?: GameModes): Observable<void> {
    return this.commandService
      .startGame(this.state, gameModes)
      .pipe(catchError(this.handleError()));
  }

  reset(gameModes?: GameModes): Observable<void> {
    return this.commandService
      .resetGame(this.state, gameModes)
      .pipe(catchError(this.handleError()));
  }

  join(players: IPlayer[]): Observable<void> {
    return this.commandService
      .addPlayers(this.state, players)
      .pipe(catchError(this.handleError()));
  }

  remove(player: IPlayer): Observable<void> {
    return this.commandService
      .removePlayer(this.state, player)
      .pipe(catchError(this.handleError()));
  }

  playCard(
    playerId: string,
    card: ICard,
    toPlayerId?: string,
  ): Observable<void> {
    return this.commandService
      .playCard(this.state, playerId, card, toPlayerId)
      .pipe(catchError(this.handleError()));
  }

  takeCard(): Observable<void> {
    return this.commandService
      .takeCard(this.state)
      .pipe(catchError(this.handleError()));
  }

  takeCardToRandomPlayer(): Observable<void> {
    return this.commandService
      .takeCardToRandomPlayer(this.state)
      .pipe(catchError(this.handleError()));
  }

  uno(yellerId?: string): Observable<void> {
    return this.commandService
      .yellUno(this.state, yellerId)
      .pipe(catchError(this.handleError()));
  }

  switchHands(player1: IPlayer, player2: IPlayer): Observable<void> {
    return this.commandService
      .switchHands(this.state, player1, player2)
      .pipe(catchError(this.handleError()));
  }

  overrideInternalState(externalState: IGameState) {
    this.state.overrideInternalState(externalState);
  }

  logs(level: LogLevel = LogLevel.USER): Observable<ILog> {
    return this.state.logs(level);
  }

  onSpecialCardPlayed(): Observable<ICard> {
    return this.state.onSpecialCardPlayed();
  }

  onCardPlayed(): Observable<ICard> {
    return this.state.onCardPlayed();
  }

  onStateChanged(): Observable<IGameState> {
    return this.state.onStateChanged();
  }

  private handleError(): (
    err: any,
    caught: Observable<void>,
  ) => Observable<any> {
    return (e: any) => {
      this.gameEvents.dispatchError(e);
      return of(e);
    };
  }
}
