import * as fs from 'fs';
import * as path from 'path';

/**
 * Read a UTF-8 text file. Throws a clear error if it doesn't exist.
 */
export function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Write a UTF-8 text file, creating parent directories if needed.
 */
export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * True if a file or directory exists at the given path.
 */
export function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Ensure a directory exists, creating it (and parents) if necessary.
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Resolve a path inside the packaged template/pack assets.
 *
 * When compiled, this file lives in dist/utils/. The templates/ and packs/
 * folders ship at the package root, one level above dist/. We walk upward
 * until we find a directory that contains both, so the CLI works whether it
 * runs from source (ts-node) or from the published dist build.
 */
export function assetPath(...segments: string[]): string {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (
      fs.existsSync(path.join(dir, 'templates')) &&
      fs.existsSync(path.join(dir, 'packs'))
    ) {
      return path.join(dir, ...segments);
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(
    'Could not locate Vibekit assets (templates/ and packs/). ' +
      'The package may be installed incorrectly.'
  );
}
