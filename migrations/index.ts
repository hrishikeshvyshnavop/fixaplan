import * as migration_20260928_061511_initial from './20260928_061511_initial';

export const migrations = [
  {
    up: migration_20260928_061511_initial.up,
    down: migration_20260928_061511_initial.down,
    name: '20260928_061511_initial'
  },
];
