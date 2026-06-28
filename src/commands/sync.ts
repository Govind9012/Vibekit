import * as path from 'path';
import { readFile, writeFile, exists, ensureDir } from '../utils/fileio';

export type SyncTool = 'copilot' | 'claude' | 'windsurf';

export const ALL_TOOLS: SyncTool[] = ['copilot', 'claude', 'windsurf'];

const TOOL_FILES: Record<SyncTool, string> = {
  copilot: '.github/copilot-instructions.md',
  claude: 'CLAUDE.md',
  windsurf: '.windsurfrules',
};

const TOOL_LABELS: Record<SyncTool, string> = {
  copilot: 'GitHub Copilot',
  claude: 'Claude Code',
  windsurf: 'Windsurf',
};

/**
 * Mirror AGENTS.md to the filenames used by tools that don't yet read
 * AGENTS.md natively. If no tools are specified, syncs to all three
 * (legacy behavior, preserved for backwards compatibility).
 */
export function syncCommand(tools: SyncTool[] = ALL_TOOLS): void {
  const cwd = process.cwd();
  const agentsPath = path.join(cwd, 'AGENTS.md');

  if (!exists(agentsPath)) {
    throw new Error('AGENTS.md not found. Run `vibekit init` first.');
  }

  if (tools.length === 0) {
    console.log('No tools selected — nothing to sync.');
    return;
  }

  const content = readFile(agentsPath);

  console.log('Synced AGENTS.md to:');
  for (const tool of tools) {
    const relPath = TOOL_FILES[tool];
    const target = path.join(cwd, relPath);
    ensureDir(path.dirname(target));
    writeFile(target, content);
    console.log(`  - ${relPath}  (${TOOL_LABELS[tool]})`);
  }
}
