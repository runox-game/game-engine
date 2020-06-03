import { Player } from '../../src/models/player.model';
import { RemovePlayerCommand } from '../../src/commands/remove-player.command';
import { GameState } from '../../src/models/game-state.model';

describe('AddPlayersCommand', () => {
  it('should remove a players from state when we execute the command', () => {
    const player1 = new Player('p1', 'player 1', 'avatar');
    const player2 = new Player('p2', 'player 2', 'avatar');
    const command = new RemovePlayerCommand(player1);
    const state = new GameState();
    state.playersGroup.addPlayer(player1);
    state.playersGroup.addPlayer(player2);
    const spy = spyOn(state.playersGroup, 'removePlayer').and.callThrough();

    command.execute(state);

    expect(spy).toBeCalled();
    expect(state.playersGroup.players.length).toBe(1);
  });
});
