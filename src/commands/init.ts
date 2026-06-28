import * as path from 'path';
import prompts from 'prompts';
import {
  readFile,
  writeFile,
  exists,
  assetPath,
} from '../utils/fileio';
import {
  extractBlock,
  insertPack,
  setActivePacksLine,
  PACK_PLACEHOLDER,
} from '../utils/markers';
import { syncCommand, SyncTool, ALL_TOOLS } from './sync';

type ProjectKind = 'dev' | 'data' | 'both' | 'skip';

const KIND_TO_PACKS: Record<ProjectKind, string[]> = {
  dev: ['core', 'dev'],
  data: ['core', 'data-eng'],
  both: ['core', 'dev', 'data-eng'],
  skip: ['core'],
};

export async function initCommand(): Promise<void> {
  const cwd = process.cwd();
  const agentsPath = path.join(cwd, 'AGENTS.md');

  if (exists(agentsPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'AGENTS.md already exists. Overwrite it?',
      initial: false,
    });
    if (!overwrite) {
      console.log('Aborted — existing AGENTS.md left untouched.');
      return;
    }
  }

  const { kind } = await prompts({
    type: 'select',
    name: 'kind',
    message: "What's this project mostly?",
    choices: [
      { title: 'Dev', value: 'dev' },
      { title: 'Data Engineering', value: 'data' },
      { title: 'Both', value: 'both' },
      { title: "Skip — I'll write my own", value: 'skip' },
    ],
    initial: 0,
  });

  // Handle abort (Ctrl+C) gracefully.
  const selected: ProjectKind = (kind as ProjectKind) ?? 'skip';
  const packs = KIND_TO_PACKS[selected];

  // Ask which AI tool(s) the user runs. Only those will get mirror files.
  // GitHub Copilot is the default selection because it's the most common
  // VS Code setup and Copilot doesn't read AGENTS.md natively yet.
  const { tools } = await prompts({
    type: 'multiselect',
    name: 'tools',
    message: 'Which AI tool(s) do you use? (space to toggle, enter to confirm)',
    instructions: false,
    choices: [
      {
        title: 'GitHub Copilot',
        value: 'copilot',
        selected: true,
        description: 'creates .github/copilot-instructions.md',
      },
      {
        title: 'Claude Code',
        value: 'claude',
        description: 'creates CLAUDE.md',
      },
      {
        title: 'Windsurf',
        value: 'windsurf',
        description: 'creates .windsurfrules',
      },
      {
        title: 'Cursor / other (reads AGENTS.md natively)',
        value: 'none',
        description: 'no extra file needed',
      },
    ],
  });

  const selectedTools: SyncTool[] = Array.isArray(tools)
    ? (tools as string[]).filter((t): t is SyncTool =>
        (ALL_TOOLS as string[]).includes(t)
      )
    : [];

  // Build AGENTS.md from the template.
  let agents = readFile(assetPath('templates', 'AGENTS.md.template'));

  if (selected === 'skip') {
    // Core only, with a hint comment about adding more packs later.
    const coreBlock = extractBlock(
      readFile(assetPath('packs', 'core.md')),
      'core'
    );
    const hint =
      '<!-- Add more packs later, e.g. `vibekit packs add dev` ' +
      'or `vibekit packs add data-eng`. See principles-catalog.md. -->';
    agents = agents.replace(PACK_PLACEHOLDER, `${coreBlock}\n\n${hint}\n`);
  } else {
    for (const name of packs) {
      const block = extractBlock(
        readFile(assetPath('packs', `${name}.md`)),
        name
      );
      agents = insertPack(agents, block);
    }
  }

  agents = setActivePacksLine(agents, packs);

  // Write the 4 files.
  writeFile(agentsPath, agents);
  writeFile(
    path.join(cwd, 'CHANGELOG.md'),
    readFile(assetPath('templates', 'CHANGELOG.md.template'))
  );
  writeFile(
    path.join(cwd, 'DECISIONS.md'),
    readFile(assetPath('templates', 'DECISIONS.md.template'))
  );
  writeFile(
    path.join(cwd, 'principles-catalog.md'),
    readFile(assetPath('principles-catalog.md'))
  );

  console.log('');
  console.log('Vibekit initialized. Created:');
  console.log('  - AGENTS.md             (stable context + active packs: ' + packs.join(', ') + ')');
  console.log('  - CHANGELOG.md          (rolling log of recent changes)');
  console.log('  - DECISIONS.md          (architecture decisions worth keeping)');
  console.log('  - principles-catalog.md (reference only — never loaded by AI)');

  // Auto-sync to the tool files the user picked so they don't have to
  // remember to run `vibekit sync` separately.
  if (selectedTools.length > 0) {
    console.log('');
    syncCommand(selectedTools);
  }

  console.log('');
  console.log("What's next:");
  console.log('  1. Fill in the Project Stack & Conventions sections of AGENTS.md.');
  console.log('  2. Record changes with:  vibekit log "what you changed"');
  if (selectedTools.length === 0) {
    console.log('  3. (Optional) mirror AGENTS.md for older tools:  vibekit sync');
  } else {
    console.log('  3. Add more tools later with:  vibekit sync --claude  (or --windsurf, --copilot)');
  }
}
