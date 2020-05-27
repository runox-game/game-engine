import { CommandsInvoker } from './commands-invoker';
import { IGameState } from '../models/game-state.model';
import { IPlayer } from '../models/player.model';
import { BuildDeckCommand } from './build-deck.command';
import { StartGameCommand } from './start-game.command';
import { AddPlayersCommand } from './add-players.command';
import { PlayCardCommand } from './play-card.command';
import { TakeDeckCardCommand } from './take-deck-card.command';
import { FinalizeTurnCommand } from './finalize-turn.command';
import { YellUnoCommand } from './yell-uno.command';
import { ICard } from '../models/card.model';
import { GameModes } from '../models/game-modes';
import { Observable } from 'rxjs';

/**
 * Class that serves as an entry point for invoking commands within the game
 */
export class CommandService {
  /**
   * Class that serves as an entry point for invoking commands within the game
   */
  constructor() {}

  /**
   * Invokes the necessary commands to start the game
   *
   * @param currentState - current game state
   * @param gameModes - different game modes
   * @returns observable with the intention of being able to track the success or failure
   * of the command group invocation
   */
  startGame(currentState: IGameState, gameModes?: GameModes): Observable<void> {
    const invoker = new CommandsInvoker([
      new BuildDeckCommand(),
      new StartGameCommand(gameModes),
    ]);

    return invoker.invoke(currentState);
  }

  /**
   * Invokes the necessary commands to add players to the game
   *
   * @param currentState - current game state
   * @param players - players to add into the game
   * @returns observable with the intention of being able to track the success or failure
   * of the command group invocation
   */
  addPlayers(currentState: IGameState, players: IPlayer[]): Observable<void> {
    const invoker = new CommandsInvoker([new AddPlayersCommand(players)]);

    return invoker.invoke(currentState);
  }

  /**
   * Invokes the necessary commands to play a card
   *
   * @param currentState - current game state
   * @param playerId - identifier of the player who wants to play a card
   * @param card - card to be played
   * @param toPlayerId - identifier of the player who will receive the card
   * @returns observable with the intention of being able to track the success or failure
   * of the command group invocation
   */
  playCard(
    currentState: IGameState,
    playerId: string,
    card: ICard,
    toPlayerId?: string,
  ): Observable<void> {
    const invoker = new CommandsInvoker([
      new PlayCardCommand(playerId, card, toPlayerId),
      new FinalizeTurnCommand(),
    ]);

    return invoker.invoke(currentState);
  }

  /**
   * Invokes the necessary commands to take a card from the deck
   *
   * @param currentState - current game state
   * @returns observable with the intention of being able to track the success or failure
   * of the command group invocation
   */
  takeCard(currentState: IGameState): Observable<void> {
    const invoker = new CommandsInvoker([
      new TakeDeckCardCommand(),
      new FinalizeTurnCommand(),
    ]);

    return invoker.invoke(currentState);
  }

  /**
   * Invokes the necessary commands to yell Uno
   *
   * @param currentState - current game state
   * @param playerId - identifier of the player who wants to yell Uno
   * @returns observable with the intention of being able to track the success or failure
   * of the command group invocation
   */
  yellUno(currentState: IGameState, yellerId?: string): Observable<void> {
    const invoker = new CommandsInvoker([new YellUnoCommand(yellerId)]);

    return invoker.invoke(currentState);
  }
}
