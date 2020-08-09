import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { Observable } from 'rxjs';
import { LogLevel } from '../log/log-levels.enum';

/**
 *  Class in charge of grouping the execution of commands that alter the game state
 */
export class CommandsInvoker {
  private readonly commands: GameCommand[];

  /**
   *  Class in charge of grouping the execution of commands that alter the game state
   *
   * @param commands - commands to execute
   */
  constructor(commands: GameCommand[]) {
    this.commands = commands;
  }

  /**
   * Loops through the list of commands validating that they can be executed
   * and executing if there are no errors during validation
   *
   * @param currentState - current game state
   * @returns observable with the intention of being able to track the success or failure
   * of the command group invocation
   */
  invoke(currentState: IGameState) {
    const observable = new Observable<void>((subscriber) => {
      try {
        for (let i = 0; i < this.commands.length; i++) {
          const command = this.commands[i];

          currentState.log(command.toString(), LogLevel.BEFORE_VALIDATION);
          const commandValidation = command.validate(currentState);
          if (!commandValidation.isValid) {
            currentState.log(
              `${command.toString()} invalid`,
              LogLevel.AFTER_VALIDATION,
            );
            subscriber.error(commandValidation.error);
            return;
          }
          currentState.log(
            `${command.toString()} valid`,
            LogLevel.AFTER_VALIDATION,
          );

          currentState.log(command.toString(), LogLevel.BEFORE_COMMAND);
          command.execute(currentState);
          currentState.log(command.toString(), LogLevel.BEFORE_COMMAND);
        }

        subscriber.next();
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    });

    return observable;
  }
}
