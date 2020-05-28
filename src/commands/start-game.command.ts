import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { ICard } from '../models/card.model';
import { CommandValidation } from './command-result';
import { BeforeTurnEvent } from '../events/before-turn.event';
import { GameModes } from '../models/game-modes';
import { LogLevel } from '../log/log-levels.enum';

/**
 * Class that allows the game to start
 */
export class StartGameCommand extends GameCommand {
  private readonly gameModes: GameModes;

  /**
   * Class that allows the game to start
   */
  constructor(gameModes?: GameModes) {
    super();

    this.gameModes = gameModes || {
      randomTakeDeckCard: false,
      dedicatePlusFour: false,
    };
  }

  execute(state: IGameState) {
    const handsLength = 7;

    state.gameModes = this.gameModes;
    state.logMessage(` Comienza el juego`, LogLevel.USER);
    state.logMessage(
      ` Comienza el juego con modos ${JSON.stringify(state.gameModes)} `,
      LogLevel.ALL,
    );

    state.logMessage(` Repartiendo cartas`, LogLevel.USER);
    state.playersGroup.players.forEach((player, index) => {
      player.hand.addCards(
        state.deck.cards.splice(index * handsLength, handsLength),
      );
    });

    let firstStackCard = state.deck.takeCard() as ICard;

    // si la carta tiene efectos entonces busca otra
    // TODO: esto simplifica la logica por el momento pero deberia ser solo para +4 y elegir color
    while (firstStackCard.hasEffects()) {
      state.logMessage(
        ` si la carta tiene efectos entonces busca otra ${firstStackCard.sprite}`,
        LogLevel.ALL,
      );
      state.logMessage(
        ` TODO: esto simplifica la logica por el momento pero deberia ser solo para +4 y elegir color`,
        LogLevel.ALL,
      );

      state.deck.addCards([firstStackCard]);

      state.logMessage(` Barajando`, LogLevel.USER);
      state.deck.shuffle();

      firstStackCard = state.deck.takeCard() as ICard;
    }

    state.stack.addCard(firstStackCard);
    state.logMessage(
      ` Carta en la mesa ${firstStackCard.sprite}`,
      LogLevel.USER,
    );

    const playerTurn = state.playersGroup.players[0];
    state.logMessage(
      ` El primer turno es para ${playerTurn.name}`,
      LogLevel.USER,
    );

    state.turn.setPlayerTurn(playerTurn);

    this.events.dispatchAfterGameStart();
    this.events.dispatchBeforeTurn(new BeforeTurnEvent(playerTurn));
  }

  validate(state: IGameState): CommandValidation {
    if (!state.playersGroup.players.length) {
      return new CommandValidation(false, 'No hay jugadores en la partida');
    }

    return new CommandValidation(true);
  }
}
