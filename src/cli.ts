#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';
import { logCommand } from './commands/log';
import { pruneCommand } from './commands/prune';
import { packsAddCommand, packsRemoveCommand } from './commands/packs';
import { syncCommand, ALL_TOOLS, SyncTool } from './commands/sync';

const program = new Command();

program
  .name('vibekit')
  .description(
    'Lean, AI-tool-agnostic project context: 3 persistent markdown files ' +
      '(AGENTS.md, CHANGELOG.md, DECISIONS.md) that keep vibe coding accurate, ' +
      'instead of heavyweight SDD specs.'
  )
  .version('0.1.4');

program
  .command('init')
  .description('Scaffold AGENTS.md, CHANGELOG.md, DECISIONS.md, and principles-catalog.md in the current directory.')
  .action(async () => {
    await initCommand();
  });

program
  .command('log')
  .description('Append a new entry to CHANGELOG.md (newest on top) with today\'s date.')
  .argument('<message>', 'short description of what changed')
  .action((message: string) => {
    logCommand(message);
  });

program
  .command('prune')
  .description('Remove resolved [DONE] changelog entries, keeping the 5 most recent.')
  .action(() => {
    pruneCommand();
  });

const packs = program
  .command('packs')
  .description('Add or remove principle packs in AGENTS.md.');

packs
  .command('add')
  .description('Insert a pack block (packs/<name>.md) into AGENTS.md.')
  .argument('<name>', 'pack name, e.g. dev or data-eng')
  .action((name: string) => {
    packsAddCommand(name);
  });

packs
  .command('remove')
  .description('Remove a pack block from AGENTS.md.')
  .argument('<name>', 'pack name, e.g. dev or data-eng')
  .action((name: string) => {
    packsRemoveCommand(name);
  });

program
  .command('sync')
  .description(
    'Mirror AGENTS.md to tool-specific files. Use flags to pick which tools ' +
      '(e.g. --copilot --claude). With no flags, syncs to all three (Copilot, ' +
      'Claude, Windsurf). `vibekit init` runs sync automatically for the ' +
      'tools you picked, so this is mainly for adding a new tool later.'
  )
  .option('--copilot', 'mirror to .github/copilot-instructions.md')
  .option('--claude', 'mirror to CLAUDE.md')
  .option('--windsurf', 'mirror to .windsurfrules')
  .action((opts: { copilot?: boolean; claude?: boolean; windsurf?: boolean }) => {
    const picked: SyncTool[] = [];
    if (opts.copilot) picked.push('copilot');
    if (opts.claude) picked.push('claude');
    if (opts.windsurf) picked.push('windsurf');
    syncCommand(picked.length > 0 ? picked : ALL_TOOLS);
  });

async function main(): Promise<void> {
  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
