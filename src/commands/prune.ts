import * as path from 'path';
import { readFile, writeFile, exists } from '../utils/fileio';

/**
 * Remove all [DONE]-tagged entries except the 5 most recent ones.
 *
 * Entries are blocks starting at a line matching "### " and running until the
 * next "### " line (or end of file). "Most recent" means earliest in the file,
 * since the changelog keeps newest entries on top.
 */
export function pruneCommand(): void {
  const cwd = process.cwd();
  const changelogPath = path.join(cwd, 'CHANGELOG.md');

  if (!exists(changelogPath)) {
    throw new Error('CHANGELOG.md not found. Run `contextkit init` first.');
  }

  const content = readFile(changelogPath);
  const lines = content.split('\n');

  // Identify entry start indices.
  const entryStarts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^###\s+/.test(lines[i])) {
      entryStarts.push(i);
    }
  }

  if (entryStarts.length === 0) {
    console.log('No changelog entries found — nothing to prune.');
    return;
  }

  const headerEnd = entryStarts[0];
  const header = lines.slice(0, headerEnd).join('\n').replace(/\s*$/, '');

  // Build entry blocks with metadata.
  interface Entry {
    text: string;
    done: boolean;
  }
  const entries: Entry[] = [];
  for (let e = 0; e < entryStarts.length; e++) {
    const start = entryStarts[e];
    const end = e + 1 < entryStarts.length ? entryStarts[e + 1] : lines.length;
    const text = lines.slice(start, end).join('\n').replace(/\s*$/, '');
    const done = /\[DONE\]/i.test(lines[start]);
    entries.push({ text, done });
  }

  // Keep the 5 most recent [DONE] entries (topmost = most recent).
  let doneKept = 0;
  const kept: Entry[] = [];
  let removed = 0;
  for (const entry of entries) {
    if (entry.done) {
      if (doneKept < 5) {
        doneKept++;
        kept.push(entry);
      } else {
        removed++;
      }
    } else {
      kept.push(entry);
    }
  }

  if (removed === 0) {
    console.log('No prunable [DONE] entries (kept the 5 most recent).');
    return;
  }

  const body = kept.map((e) => e.text).join('\n\n');
  const rebuilt = `${header}\n\n${body}\n`.replace(/\n{3,}/g, '\n\n');
  writeFile(changelogPath, rebuilt);

  console.log(
    `Pruned ${removed} resolved [DONE] ${
      removed === 1 ? 'entry' : 'entries'
    } (kept the 5 most recent).`
  );
}
