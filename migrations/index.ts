import * as migration_20260925_125155_initial from './20260925_125155_initial';

export const migrations = [
  {
    up: migration_20260925_125155_initial.up,
    down: migration_20260925_125155_initial.down,
    name: '20260925_125155_initial'
  },
];
