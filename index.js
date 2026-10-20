import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The loader resolves `styles` inside this directory's public/ subdir, so the
// manifest has to say where it lives.
export const dir = path.dirname(fileURLToPath(import.meta.url));

export default {
  id: 'minimal-board',
  label: 'Minimal board',
  help: 'Stacks task lanes vertically and shrinks each session card to its title and status colour.',
  defaultEnabled: true,
  // Styles only: a `styles` sheet with no client module has been served since
  // the first host API, so any 1.x host can load it.
  engines: { wranglerApi: '^1.0.0' },
  requires: [],
  // The loader adds this <link> on enable and removes it on disable, which is
  // what restores the normal board.
  styles: 'public/minimal-board.css',
};
