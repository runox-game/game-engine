import { TakeCardRandomPlayerCommand } from '../../src/commands/take-card-random-player.command';
import { GameState } from '../../src/models/game-state.model';
import { Card } from '../../src/models/card.model';
import { Value } from '../../src/models/values.model';
import { Player } from '../../src/models/player.model';

describe('TakeCardRandomPlayerCommand', () => {
  it('should return error result when there is no cards in the deck and we execute the command', () => {
    const command = new TakeCardRandomPlayerCommand();
    const state = new GameState();

    const commandValidation = command.validate(state);

    expect(commandValidation.isValid).toBeFalsy();
    expect(state.deck.cards.length).toBe(0);
  });

  it('should return error result when there is not a player turn', () => {
    const command = new TakeCardRandomPlayerCommand();
    const state = new GameState();
    const card = new Card(Value.PLUS_FOUR);

    state.deck.addCards([card]);

    const commandValidation = command.validate(state);

    expect(commandValidation.isValid).toBeFalsy();
  });

  it('should add the card taken from the deck to unique player', () => {
    const command = new TakeCardRandomPlayerCommand();
    const state = new GameState();
    const player = new Player('p1', 'player 1', 'avatar');

    state.playersGroup.addPlayer(player);
    state.deck.addCards([new Card(Value.PLUS_FOUR), new Card(Value.WILDCARD)]);
    state.turn.setPlayerTurn(player);

    const takeCardSpy = spyOn(state.deck, 'takeCard').and.callThrough();

    command.execute(state);

    expect(player.hand.cards.length).toBeGreaterThan(0);
    expect(takeCardSpy).toBeCalled();
  });

  it('should add the card taken from the deck to random player', () => {
    const command = new TakeCardRandomPlayerCommand();
    const state = new GameState();
    const player1 = new Player('p1', 'player 1', 'avatar');
    const player2 = new Player('p1', 'player 1', 'avatar');

    state.playersGroup.addPlayers([player1, player2]);
    state.deck.addCards([new Card(Value.PLUS_FOUR), new Card(Value.WILDCARD)]);
    state.turn.setPlayerTurn(player1);

    const takeCardSpy = spyOn(state.deck, 'takeCard').and.callThrough();

    command.execute(state);

    const cardTaken = player1.hand.cards.length + player2.hand.cards.length;
    expect(cardTaken).toBeGreaterThan(0);
    expect(cardTaken).toBeLessThan(2);

    expect(takeCardSpy).toBeCalled();
  });
});
