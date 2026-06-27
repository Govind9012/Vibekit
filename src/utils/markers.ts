/**
 * Utilities for parsing, inserting, and removing pack marker blocks of the form:
 *
 *   <!-- pack:<name>:start -->
 *   ...content...
 *   <!-- pack:<name>:end -->
 *
 * These markers live inside AGENTS.md and the packs/*.md source files.
 */

export const PACK_PLACEHOLDER = '{{PACK_BLOCKS_INSERTED_HERE}}';
export const PACKS_PLACEHOLDER = '{{PACKS}}';

const ACTIVE_PACKS_LINE = /^### Active principle packs:.*$/m;

/**
 * Build a regex that matches a single pack block (start marker through end
 * marker, inclusive) for the given pack name.
 */
export function packBlockRegex(name: string): RegExp {
  const escaped = escapeRegExp(name);
  return new RegExp(
    `<!--\\s*pack:${escaped}:start\\s*-->[\\s\\S]*?<!--\\s*pack:${escaped}:end\\s*-->`,
    'm'
  );
}

/**
 * Global regex matching any pack block, capturing the pack name in group 1.
 */
export function anyPackBlockRegex(): RegExp {
  return /<!--\s*pack:([a-zA-Z0-9_-]+):start\s*-->[\s\S]*?<!--\s*pack:\1:end\s*-->/g;
}

/**
 * Return the list of active pack names found in the given content, in order.
 */
export function listActivePacks(content: string): string[] {
  const names: string[] = [];
  const regex = anyPackBlockRegex();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/**
 * True if the named pack block is present in content.
 */
export function hasPack(content: string, name: string): boolean {
  return packBlockRegex(name).test(content);
}

/**
 * Extract the marker block for a pack from a packs/*.md source file.
 * Falls back to the raw (trimmed) file content if no markers are present.
 */
export function extractBlock(packFileContent: string, name: string): string {
  const match = packFileContent.match(packBlockRegex(name));
  if (match) {
    return match[0].trim();
  }
  return packFileContent.trim();
}

/**
 * Remove a pack block (and surrounding blank lines) from content.
 */
export function removePack(content: string, name: string): string {
  const regex = packBlockRegex(name);
  if (!regex.test(content)) {
    return content;
  }
  const without = content.replace(regex, '');
  return collapseBlankLines(without);
}

/**
 * Insert a pack block into AGENTS.md content.
 *
 * If other pack blocks already exist, the new block is inserted immediately
 * after the last existing pack block. Otherwise it replaces the
 * {{PACK_BLOCKS_INSERTED_HERE}} placeholder, or is appended after the
 * Verify-before-trust section if the placeholder is gone.
 */
export function insertPack(content: string, block: string): string {
  // If the placeholder still exists (fresh template), replace it.
  if (content.includes(PACK_PLACEHOLDER)) {
    return content.replace(PACK_PLACEHOLDER, `${block}\n`);
  }

  const activePacks = listLastBlockMatch(content);
  if (activePacks) {
    const insertAt = activePacks.index + activePacks.length;
    return (
      content.slice(0, insertAt) + `\n\n${block}` + content.slice(insertAt)
    );
  }

  // No existing packs and no placeholder: insert after Verify-before-trust.
  const verifyRegex = /(### Verify-before-trust[\s\S]*?source of truth — not the note\.)/m;
  const verifyMatch = content.match(verifyRegex);
  if (verifyMatch && verifyMatch.index !== undefined) {
    const insertAt = verifyMatch.index + verifyMatch[0].length;
    return (
      content.slice(0, insertAt) + `\n\n${block}` + content.slice(insertAt)
    );
  }

  // Last resort: append to the end.
  return `${content.trimEnd()}\n\n${block}\n`;
}

/**
 * Replace (or set) the "Active principle packs" line with the given names.
 */
export function setActivePacksLine(content: string, names: string[]): string {
  const value = names.length > 0 ? names.join(', ') : '(none)';
  const line = `### Active principle packs: ${value}`;
  if (ACTIVE_PACKS_LINE.test(content)) {
    return content.replace(ACTIVE_PACKS_LINE, line);
  }
  return content;
}

/** Find the last pack block and return its index and length. */
function listLastBlockMatch(
  content: string
): { index: number; length: number } | null {
  const regex = anyPackBlockRegex();
  let match: RegExpExecArray | null;
  let last: { index: number; length: number } | null = null;
  while ((match = regex.exec(content)) !== null) {
    last = { index: match.index, length: match[0].length };
  }
  return last;
}

function collapseBlankLines(content: string): string {
  return content.replace(/\n{3,}/g, '\n\n');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
