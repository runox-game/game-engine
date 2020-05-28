import { IGameState } from '../models/game-state.model';
import { CommandValidation } from './command-result';
import { GameEvents } from '../events/game-events';
import { LogLevel } from '../log/log-levels.enum';

/**
 * Abstract class that serves as the basis for all game engine commands
 */
export abstract class GameCommand {
  /**
   * Game events
   */
  protected readonly events = GameEvents.getInstance();

  constructor() {}

  /**
   * Executes a command that makes changes to the internal game state
   *
   * @remarks
   * This method does not perform validations on models because it always assumes
   * that the validate() method was previously called
   *
   * @param state - Current game state
   * @returns void
   */
  abstract execute(state: IGameState): void;

  /**
   * Validates that the state is in optimal conditions to be able to execute the command
   *
   * @remarks
   * This method must always be invoked before the execute() method
   *
   * @param state - Current game state
   * @returns object with validation result
   */
  abstract validate(state: IGameState): CommandValidation;

  /**
   * Log message in the state with a level asigned. 
   * 
   * @remarks
   * If levels is undefined will be assigned LogLevel.DEFAULT
   *
   * @param state
   * @param message
   * @param level
   */
  logMessage(state: IGameState, message: string, level?: LogLevel) {
    state.log({ level: level ?? LogLevel.DEFAULT, mesagge: message });
  }
}
