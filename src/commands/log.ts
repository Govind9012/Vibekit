import * as path from 'path';
import { readFile, writeFile, exists } from '../utils/fileio';

const CHANGELOG_HEADING = /^## Changelog\s*$/m;
const EMPTY_PLACEHOLDER =
  /\(no entries yet — run `vibekit log "description"` after your first change\)\s*/;

/**
 * Append a new changelog entry (newest on top) with today's ISO date.
 */
export function logCommand(message: string): void {
  if (!message || !message.trim()) {
    throw new Error('A message is required: vibekit log "what you changed"');
  }

  const cwd = process.cwd();
  const changelogPath = path.join(cwd, 'CHANGELOG.md');

  if (!exists(changelogPath)) {
    throw new Error(
      'CHANGELOG.md not found. Run `vibekit init` first.'
    );
  }

  let content = readFile(changelogPath);
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const entry = `### ${date} — ${message.trim()}\nFiles: \n`;

  // Drop the "no entries yet" placeholder if present.
  content = content.replace(EMPTY_PLACEHOLDER, '');

  const headingMatch = content.match(CHANGELOG_HEADING);
  if (headingMatch && headingMatch.index !== undefined) {
    const insertAt = headingMatch.index + headingMatch[0].length;
    const before = content.slice(0, insertAt).replace(/\s*$/, '');
    const after = content.slice(insertAt).replace(/^\s*/, '');
    content = `${before}\n\n${entry}\n${after}`.replace(/\n{3,}/g, '\n\n');
  } else {
    // No heading found — prepend.
    content = `## Changelog\n\n${entry}\n${content}`;
  }

  writeFile(changelogPath, content.replace(/\s*$/, '') + '\n');

  console.log(`Logged entry for ${date}: ${message.trim()}`);

  const activeCount = countActiveEntries(content);
  if (activeCount > 10) {
    console.log('');
    console.log(
      `You now have ${activeCount} active entries. ` +
        'Consider running `vibekit prune` to trim resolved [DONE] entries.'
    );
  }
}

/**
 * Count entries (lines starting with "### ") that are NOT tagged [DONE].
 */
function countActiveEntries(content: string): number {
  const lines = content.split('\n');
  let count = 0;
  for (const line of lines) {
    if (/^###\s+/.test(line) && !/\[DONE\]/i.test(line)) {
      count++;
    }
  }
  return count;
}
