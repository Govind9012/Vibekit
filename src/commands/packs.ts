import * as path from 'path';
import { readFile, writeFile, exists, assetPath } from '../utils/fileio';
import {
  extractBlock,
  insertPack,
  removePack,
  hasPack,
  listActivePacks,
  setActivePacksLine,
} from '../utils/markers';

function loadAgents(): { agentsPath: string; content: string } {
  const cwd = process.cwd();
  const agentsPath = path.join(cwd, 'AGENTS.md');
  if (!exists(agentsPath)) {
    throw new Error('AGENTS.md not found. Run `vibekit init` first.');
  }
  return { agentsPath, content: readFile(agentsPath) };
}

export function packsAddCommand(name: string): void {
  if (!name) {
    throw new Error('Usage: vibekit packs add <name>');
  }

  const packFile = assetPath('packs', `${name}.md`);
  if (!exists(packFile)) {
    throw new Error(
      `Pack "${name}" does not exist in packs/. ` +
        'See principles-catalog.md for available packs, or create packs/' +
        `${name}.md with matching <!-- pack:${name}:start --> markers.`
    );
  }

  const { agentsPath, content } = loadAgents();

  if (hasPack(content, name)) {
    console.log(`Pack "${name}" is already active in AGENTS.md.`);
    return;
  }

  const block = extractBlock(readFile(packFile), name);
  let updated = insertPack(content, block);
  updated = setActivePacksLine(updated, listActivePacks(updated));
  writeFile(agentsPath, updated);

  console.log(`Added pack "${name}" to AGENTS.md.`);
}

export function packsRemoveCommand(name: string): void {
  if (!name) {
    throw new Error('Usage: vibekit packs remove <name>');
  }

  const { agentsPath, content } = loadAgents();

  if (!hasPack(content, name)) {
    throw new Error(
      `Pack "${name}" is not currently active in AGENTS.md. ` +
        `Active packs: ${listActivePacks(content).join(', ') || '(none)'}.`
    );
  }

  let updated = removePack(content, name);
  updated = setActivePacksLine(updated, listActivePacks(updated));
  writeFile(agentsPath, updated);

  console.log(`Removed pack "${name}" from AGENTS.md.`);
}
