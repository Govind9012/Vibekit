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
  console.log('');
  console.log("What's next:");
  console.log('  1. Fill in the Project Stack & Conventions sections of AGENTS.md.');
  console.log('  2. Record changes with:  vibekit log "what you changed"');
  console.log('  3. (Optional) mirror AGENTS.md for older tools:  vibekit sync');
}
