import { promisify } from 'util';
import { execFile, spawn } from 'child_process';
import { dirname } from 'path';
import { readFile } from 'fs/promises';

const execFileAsync = promisify(execFile);

// Custom error type for OsaScript errors
export class OsaScriptError extends Error {
  constructor(
    message: string,
    public readonly stderr?: string,
    public readonly code?: number
  ) {
    super(message);
    this.name = 'OsaScriptError';
  }
}

// Types
export interface OsaScriptOptions {
  cwd?: string;
  variables?: Record<string, unknown>;
}

export interface OsaScriptResult {
  stdout: string;
  stderr: string;
}

// Helper functions
function serializeValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'missing value';
  if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (Array.isArray(value)) {
    return `{${value.map(serializeValue).join(', ')}}`;
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}:${serializeValue(v)}`)
      .join(', ');
  }
  throw new OsaScriptError(`Unsupported value type: ${typeof value}`);
}

function generateVariables(variables: Record<string, unknown>): string {
  return Object.entries(variables)
    .map(([key, value]) => `set ${key} to ${serializeValue(value)}\n`)
    .join('');
}

// Main functions
export async function execute(
  script: string,
  options: OsaScriptOptions = {}
): Promise<string> {
  const { variables, cwd } = options;
  const finalScript = variables 
    ? generateVariables(variables) + script
    : script;

  try {
    const { stdout } = await execFileAsync(
      'osascript',
      ['-e', finalScript],
      { cwd }
    );
    return stdout.trim();
  } catch (error: any) {
    throw new OsaScriptError(
      error.message,
      error.stderr,
      error.code
    );
  }
}

export async function executeFile(
  path: string,
  options: OsaScriptOptions = {}
): Promise<string> {
  try {
    const script = await readFile(path, 'utf-8');
    return execute(script, {
      ...options,
      cwd: options.cwd ?? dirname(path)
    });
  } catch (error: any) {
    throw new OsaScriptError(
      `Failed to execute script file: ${error.message}`,
      error.stderr,
      error.code
    );
  }
}

export function run(
  script: string,
  options: OsaScriptOptions = {}
): void {
  const { variables, cwd } = options;
  const finalScript = variables 
    ? generateVariables(variables) + script
    : script;

  const child = spawn('osascript', ['-e', finalScript], {
    detached: true,
    stdio: 'ignore',
    cwd
  });
  
  child.unref();
}
