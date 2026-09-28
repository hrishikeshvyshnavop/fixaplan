import * as migration_20260925_125155_initial from './20260925_125155_initial';
import * as migration_20260928_052608_faq_global from './20260928_052608_faq_global';

export const migrations = [
  {
    up: migration_20260925_125155_initial.up,
    down: migration_20260925_125155_initial.down,
    name: '20260925_125155_initial',
  },
  {
    up: migration_20260928_052608_faq_global.up,
    down: migration_20260928_052608_faq_global.down,
    name: '20260928_052608_faq_global'
  },
];
