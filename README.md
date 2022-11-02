# Competition Tracker

The competition tracker is a web app with the goal to allow users to track any kind of competition (e.g. sports, board games).
One of the key features is to provide an option to create "guests". By doing so, not every participant needs to register.
The creator of a guest can later assign the guest account to an actual user.

Also the competitions shall be managed by the users. When adding someone as friend, you will have the option to also access their competitions.
In case of duplications the competitions can be merged (e.g. if both friends have added UNO as a competition).

The project is still under heavy development and not yet hosted or ready to use.

## Todos

- [X] Login
- [X] Register
- [X] Logout
- [X] Delete Account
- [X] Create Competition
- [ ] Update Competition
- [ ] Delete Competition
- [ ] Add Friend
- [ ] Remove Friend
- [ ] Create Track
- [ ] Update Track
- [ ] Delete Track

## Concepts

### Competitions

Competitions consist out of `name`, `has_teams`, `has_points` atrributes. If a competition has points, the optional property `highest_points_win` will also be added to determine if a the player with the highest or lowest amount of points wins.

### Friends

Users can add other users (via their email) as friend. When adding them as friend they will automatically get access to all their competitions (to track against them as well).

### Guests

As not everyone want's to register, there is also the option to create new guest users. This are users that are managed by their creator. With regards to creating new tracks, they are treated like normal users.

In case someone decides to register and was previously tracked as a guest, the creator of the guest can merge the data of the guest into a friend. By doing so the guest will be completly replaced with the friend the data was merged into.

### Score

The competition tracker should indicate how good player is by giving them a score for every competition. The calculation logic is as follows.

In case of winning a competition the player receives `floor(25 / amountOfPlayersInHisTeam) + 1` points.

In case of losing a competition the player loses `floor(25 / amountOfPlayersInHisTeam) - 1` points.

A few examples:
- 5 people play UNO, the winner receives 26 points, all others lose 24
- 4 people play 2vs2 tabletennis, everyone on the winning team receives 13 points, everyone in the losing team loses 11 points

The idea behind this system is to enhance a simple +-25 points per win/lose, by giving people a small benefit (of 1 point) for every competition they participated.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
