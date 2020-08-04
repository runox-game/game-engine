import { GameEngine } from '../src/game-engine';
import { GameState } from '../src/models/game-state.model';

describe('GameEngine', () => {
  it('should be ivalid', () => {
    const game = new GameEngine();
    const externalState = {
        playersGroup: {
            players: []
        },
        gameModes: {
            randomTakeDeckCard: false
        },
        stack: {
            cards: []
        },
        turn: {},
        winner: undefined,
        gameDirection: 0,
        unoYellers: {},
        deck: {
            cards: []
        },
        start: false,
        id: "1595987809820",
        cardsToGive: 0,
        name: "micasa"
    };
    // expect(() => game.overrideInternalState(externalState)).toThrowError();
  });
});

