import { GameCommand } from './game.command';
import { IGameState } from '../models/game-state.model';
import { ICard } from '../models/card.model';
import { CommandValidation } from './command-result';
import { BeforeTurnEvent } from '../events/before-turn.event';
import { GameModes } from '../models/game-modes';
import { LogLevel } from '../log/log-levels.enum';
import { Constants } from '../constants';

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
    const handsLength = Constants.NUMBER_OF_CARD_IN_HAND_ON_START;

    state.gameModes = this.gameModes;
    state.log(` Comienza el juego`, LogLevel.USER);
    state.log(
      ` Comienza el juego con modos ${JSON.stringify(state.gameModes)} `,
      LogLevel.ALL,
    );

    state.log(` Orden aleatorio a los jugadores`, LogLevel.USER);
    state.playersGroup.shufflePlayers();
    state.log(
      `El orden de los jugadores es: ${state.playersGroup.players
        .map((x) => x.name)
        .join(', ')}`,
      LogLevel.USER,
    );

    state.log(` Repartiendo cartas`, LogLevel.USER);
    state.playersGroup.players.forEach((player, index) => {
      player.hand.addCards(
        state.deck.cards.splice(index * handsLength, handsLength),
      );
    });

    let firstStackCard = state.deck.takeCard() as ICard;

    // si la carta tiene efectos entonces busca otra
    // TODO: esto simplifica la logica por el momento pero deberia ser solo para +4 y elegir color
    while (firstStackCard.hasEffects()) {
      state.log(
        ` si la carta tiene efectos entonces busca otra ${firstStackCard.sprite}`,
        LogLevel.ALL,
      );
      state.log(
        ` TODO: esto simplifica la logica por el momento pero deberia ser solo para +4 y elegir color`,
        LogLevel.ALL,
      );

      state.deck.addCards([firstStackCard]);

      state.log(`Barajando`, LogLevel.USER);
      state.deck.shuffle();

      firstStackCard = state.deck.takeCard() as ICard;
    }

    state.stack.addCard(firstStackCard);
    state.log(` Carta en la mesa ${firstStackCard.sprite}`, LogLevel.USER);

    const playerTurn = state.playersGroup.players[0];
    state.log(` El primer turno es para ${playerTurn.name}`, LogLevel.USER);

    state.turn.round = 0;
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
