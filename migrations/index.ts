import * as migration_20260928_061511_initial from './20260928_061511_initial';
import * as migration_20260928_095734_media from './20260928_095734_media';
import * as migration_20260930_060328_hero from './20260930_060328_hero';
import * as migration_20260930_094501_live_preview_drafts from './20260930_094501_live_preview_drafts';
import * as migration_20260930_100944_hero_background from './20260930_100944_hero_background';
import * as migration_20260930_102330_hero_video_url from './20260930_102330_hero_video_url';

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
    name: '20260930_060328_hero',
  },
  {
    up: migration_20260930_094501_live_preview_drafts.up,
    down: migration_20260930_094501_live_preview_drafts.down,
    name: '20260930_094501_live_preview_drafts',
  },
  {
    up: migration_20260930_100944_hero_background.up,
    down: migration_20260930_100944_hero_background.down,
    name: '20260930_100944_hero_background',
  },
  {
    up: migration_20260930_102330_hero_video_url.up,
    down: migration_20260930_102330_hero_video_url.down,
    name: '20260930_102330_hero_video_url'
  },
];
