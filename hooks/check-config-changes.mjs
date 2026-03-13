#!/usr/bin/env node
/**
 * Stop hook — runs at end of every Claude Code session.
 * Checks if any config files were modified during this session.
 * If yes, prints a reminder banner to run /sync-setup.
 *
 * How it works:
 * - Reads a timestamp file (.claude/hooks/.last-sync) written by /sync-setup after each run
 * - Compares that timestamp against the mtime of tracked config files
 * - If any config file is newer than the last sync → print reminder
 */

import { statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const CLAUDE_DIR = join(HOME, '.claude');
const LAST_SYNC_FILE = join(CLAUDE_DIR, 'hooks', '.last-sync');

const TRACKED = [
  join(HOME, '.claude.json'),
  join(HOME, '.claude', 'settings.json'),
  join(HOME, '.claude', 'skills'),
  join(HOME, '.claude', 'rules', 'common'),
];

function getLastSyncTime() {
  if (!existsSync(LAST_SYNC_FILE)) return 0;
  try {
    return parseInt(readFileSync(LAST_SYNC_FILE, 'utf8').trim(), 10) || 0;
  } catch {
    return 0;
  }
}

function getMaxMtime(paths) {
  let max = 0;
  for (const p of paths) {
    try {
      const st = statSync(p);
      const t = st.mtimeMs;
      if (t > max) max = t;
    } catch {
      // file/dir doesn't exist — skip
    }
  }
  return max;
}

const lastSync = getLastSyncTime();
const lastChange = getMaxMtime(TRACKED);

if (lastChange > lastSync) {
  const border = '─'.repeat(60);
  console.log(`\n┌${border}┐`);
  console.log(`│  ⚠  Config files changed since last sync setup doc       │`);
  console.log(`│     Run /sync-setup to update the setup Google Doc        │`);
  console.log(`└${border}┘\n`);
}
