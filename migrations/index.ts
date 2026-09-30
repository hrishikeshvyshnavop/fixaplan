import * as migration_20260928_061511_initial from './20260928_061511_initial';
import * as migration_20260928_095734_media from './20260928_095734_media';
import * as migration_20260930_060328_hero from './20260930_060328_hero';

export const migrations = [
  {
    up: migration_20260928_061511_initial.up,
    down: migration_20260928_061511_initial.down,
    name: '20260928_061511_initial',
  },
  {
    up: migration_20260928_095734_media.up,
    down: migration_20260928_095734_media.down,
    name: '20260928_095734_media',
  },
  {
    up: migration_20260930_060328_hero.up,
    down: migration_20260930_060328_hero.down,
    name: '20260930_060328_hero'
  },
];
