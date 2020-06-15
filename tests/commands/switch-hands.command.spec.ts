import { Player } from '../../src/models/player.model';
import { SwitchHandsCommand } from '../../src/commands/switch-hands.command';
import { GameState } from '../../src/models/game-state.model';
import { Card } from '../../src/models/card.model';
import { Value } from '../../src/models/values.model';

describe('SwitchHandsCommand', () => {
  it('should switch cards of player s hand when we execute the command', () => {
    const player1 = new Player('p1', 'player 1', 'avatar');
    const player2 = new Player('p2', 'player 2', 'avatar');

    player1.hand.addCard(new Card(Value.PLUS_FOUR));
    player2.hand.addCard(new Card(Value.PLUS_TWO));
    
    const command = new SwitchHandsCommand(player1, player2);
    const state = new GameState();
    
    command.execute(state);
    
    expect(player1.hand.cards.length).toBe(1);
    expect(player2.hand.cards.length).toBe(1);

    expect(player1.hand.hasCard(Value.PLUS_FOUR)).toBe(false)
    expect(player1.hand.hasCard(Value.PLUS_TWO)).toBe(true)
    
    expect(player2.hand.hasCard(Value.PLUS_FOUR)).toBe(true)
    expect(player2.hand.hasCard(Value.PLUS_TWO)).toBe(false)
  });
});
