import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { Card } from '../models/card.model';
import { COLORS } from '../models/color.model';
import { Value, VALUES } from '../models/values.model';
import { CommandValidation } from './command-result';
import { LogLevel } from '../log/log-levels.enum';

/**
 * Class that allows cards creation and add them to the game deck
 */
export class BuildDeckCommand extends GameCommand {
  /**
   * Class that allows cards creation and add them to the game deck
   */
  constructor() {
    super();
  }

  execute(state: IGameState) {
    state.logMessage(`Construyendo tablero`, LogLevel.USER);
    /*
      Traditional deck contains:
      - +4 x2
      - wildcard x2
      - color cards x2
    */
    const specialCards = [Value.PLUS_FOUR, Value.WILDCARD];

    state.logMessage(
      `Cartas especiales ${JSON.stringify(specialCards)}`,
      LogLevel.USER,
    );

    state.logMessage(`Agregando cartas`, LogLevel.USER);
    state.deck.addCards([
      ...specialCards.map((specialCard) => new Card(specialCard)),
      ...specialCards.map((specialCard) => new Card(specialCard)),
    ]);

    COLORS.forEach((color) => {
      VALUES.filter(
        (card) => card !== Value.WILDCARD && card !== Value.PLUS_FOUR,
      ).forEach((card) => {
        const newCard1 = new Card(card, color);
        const newCard2 = new Card(card, color);

        state.deck.addCards([newCard1, newCard2]);
      });
    });

    state.logMessage(`Agregando cartas`, LogLevel.USER);

    state.logMessage(`Barajando`, LogLevel.USER);
    state.deck.shuffle();
  }

  validate(state: IGameState) {
    return new CommandValidation(true);
  }
}
