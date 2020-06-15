## Runox-Game-Engine

# Example

```[typescript]
const game = new GameEngine();
```

# Methods of GameEngine

- start

```[typescript]
game.start().subscribe(
  () => {},
  (error: string) => {
    // handle error
  }
);
```

Also, you can use different game modes passing a GameModes object as parameter (by default all game modes are deactivated)

```[typescript]
const gameModes: GameModes = {
  randomTakeDeckCard: false,
  cumulativePlusTwo: false,
  dedicatePlusFour: false,
  crazyCommands: false,
};

game.start(gameModes).subscribe(
  () => {},
  (error: string) => {
    // handle error
  }
);
```

```[typescript]
game.start().subscribe(
  () => {},
  (error: string) => {
    // handle error
  }
);
```

- reset

```[typescript]
game.reset().subscribe(
  () => {},
  (error: string) => {
    showErrorAlert(error);
  }
);
```

- reset

```[typescript]
game.reset().subscribe(
  () => {},
  (error: string) => {
    showErrorAlert(error);
  }
);
```

- join

```[typescript]
game.join([user]).subscribe();
```

- remove

```[typescript]
game.remove(user).subscribe();
```

- playCard

```[typescript]
game.playCard(game.playerTurn?.id, card).subscribe();
```

- takeCard

```[typescript]
game.takeCard();
```

- takeCardToRandomPlayer

```[typescript]
game.takeCardToRandomPlayer();
```

- uno

```[typescript]
game.uno(user.id);
```

- overrideInternalState

```[typescript]
game.overrideInternalState(_data);
```

- logs

```[typescript]
game.logs().subscribe((log: ILog) => {
  console.log(log);
});
```
