import type { HeritageEntry } from '../types';
import { barjeel } from './barjeel';
import { dallah } from './dallah';
import { mosque } from './mosque';
import { alain } from './alain';

export { SOURCES } from './sources';
export const ENTRIES: HeritageEntry[] = [barjeel, dallah, mosque, alain];
export const ENTRY_BY_ID: Record<string, HeritageEntry> = Object.fromEntries(ENTRIES.map((e) => [e.id, e]));
