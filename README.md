# aw-ext-minimal-board

An Agent Wrangler extension that simplifies the board:

- **Lanes stack vertically.** Task lanes always sit one above another, the way the
  board lays out when the terminal pane is very wide, and the board scrolls.
- **One-row cards.** Each session card shows only its title, with its status as a
  coloured stripe and a tint: green for working, red for needs input, cyan for done
  and grey for idle. Chips, icons, the folder and branch, and sub-agent rows are gone.

Disabling the extension restores the normal board. It is presentation only, with no
server state.

It is a styles-only extension: the manifest's `styles` sheet
(`public/minimal-board.css`) does all the work, with no client script. The host adds the
sheet when the extension is enabled and removes it when disabled. It needs host API
`^1.0.0`. Every rule is scoped to `#grid`, so the detail panel is untouched. Focus mode
keeps its own layout, though its cards are compact too.

## Install

Extensions panel → install by git URL:

```
https://github.com/alex-pezarro-portswigger/aw-ext-minimal-board
```

`package-lock.json` is committed even with no dependencies, because older hosts refuse
an install without one.

## Tests

```
npm test
```

The tests check that the manifest is valid and matches the `package.json` declaration,
that the lockfile matches, that the extension is styles only, that every selector is
scoped to the board grid, and that each status has its own colour.
