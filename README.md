## Runox-Game-Engine

# Example

```[typescript]
const game = new GameEngine();
```

# Methods of GameEngine

- start

```[typescript]
const gameModes: GameModes = {
  randomTakeDeckCard: false,
};
game.start(gameModes).subscribe(
  () => {},
  (error: string) => {
    showErrorAlert(error);
  }
);
```

- join

```[typescript]
const user: Player;
game.join([user]).subscribe();
```

- remove

```[typescript]
const user: Player;
game.remove(user).subscribe();
```

- playCard

```[typescript]
const card: ICard;
game.playCard(game.playerTurn?.id, card).subscribe();
```

- takeCard

```[typescript]
game.takeCard()
```

- uno

```[typescript]
const user: Player;
game.uno(user.id)
```

- overrideInternalState

```[typescript]
const state = IGameState;
game.overrideInternalState(_data);
```

- logs

```[typescript]
game.logs().subscribe((log: ILog) => {
  console.log(log);
});
```
