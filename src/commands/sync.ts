import * as path from 'path';
import { readFile, writeFile, exists, ensureDir } from '../utils/fileio';

/**
 * Mirror AGENTS.md to the filenames used by tools that don't yet read
 * AGENTS.md natively.
 */
export function syncCommand(): void {
  const cwd = process.cwd();
  const agentsPath = path.join(cwd, 'AGENTS.md');

  if (!exists(agentsPath)) {
    throw new Error('AGENTS.md not found. Run `vibekit init` first.');
  }

  const content = readFile(agentsPath);

  const targets = [
    path.join(cwd, 'CLAUDE.md'),
    path.join(cwd, '.windsurfrules'),
    path.join(cwd, '.github', 'copilot-instructions.md'),
  ];

  ensureDir(path.join(cwd, '.github'));

  for (const target of targets) {
    writeFile(target, content);
  }

  console.log('Synced AGENTS.md to:');
  console.log('  - CLAUDE.md');
  console.log('  - .windsurfrules');
  console.log('  - .github/copilot-instructions.md');
}
