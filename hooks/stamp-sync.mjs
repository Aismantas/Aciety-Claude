#!/usr/bin/env node
/**
 * Called by /sync-setup at the end of a successful run.
 * Writes the current timestamp to .last-sync so the Stop hook
 * knows the doc is fresh and won't show the reminder banner.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const LAST_SYNC_FILE = join(homedir(), '.claude', 'hooks', '.last-sync');
writeFileSync(LAST_SYNC_FILE, Date.now().toString(), 'utf8');
console.log('✅ Sync timestamp updated.');
