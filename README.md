# @7c/osascript

A modern TypeScript/Node.js library for executing AppleScript commands on macOS. This library provides both Promise-based execution and fire-and-forget functionality for AppleScript commands.

## Features

- Promise-based API with async/await support
- Fire-and-forget execution that survives process crashes
- Full TypeScript support with proper type definitions
- Variable injection into AppleScript commands
- Custom error types with detailed error information
- Modern ES6+ syntax and patterns

## Installation

```bash
npm install @7c/osascript --save
```

## Usage

### Basic Example

```typescript
import { execute, run } from '@7c/osascript';

// Using async/await
async function showDialog() {
  try {
    const result = await execute('display dialog "Hello World"');
    console.log('Dialog result:', result);
  } catch (error) {
    console.error('Dialog failed:', error);
  }
}

// Fire and forget (survives process crashes)
run('display notification "Background Task Complete" with title "Done"');
```

### Using Variables

```typescript
import { execute, OsaScriptOptions } from '@7c/osascript';

async function showCustomDialog() {
  const options: OsaScriptOptions = {
    variables: {
      title: "My Dialog",
      message: "Choose an option",
      buttons: ["OK", "Cancel", "Help"]
    }
  };

  try {
    const result = await execute(`
      tell application "System Events"
        display dialog message ¬
          with title title ¬
          buttons buttons ¬
          default button "OK"
      end tell
    `, options);
    
    console.log('User clicked:', result);
  } catch (error) {
    console.error('Dialog failed:', error);
  }
}
```

### Error Handling

```typescript
import { execute, OsaScriptError } from '@7c/osascript';

async function handleErrors() {
  try {
    await execute('some invalid script');
  } catch (error) {
    if (error instanceof OsaScriptError) {
      console.error('Script Error:', error.message);
      console.error('stderr:', error.stderr);
      console.error('exit code:', error.code);
    }
  }
}
```

## API

### execute()

Executes an AppleScript command and returns a Promise with the result.

```typescript
async function execute(
  script: string,
  options?: OsaScriptOptions
): Promise<string>
```

#### Parameters

- `script`: The AppleScript command to execute
- `options`: (Optional) Configuration options
  - `variables`: Variables to inject into the script
  - `cwd`: Working directory path

### executeFile()

Executes an AppleScript file and returns a Promise with the result.

```typescript
async function executeFile(
  path: string,
  options?: OsaScriptOptions
): Promise<string>
```

#### Parameters

- `path`: Path to the AppleScript file
- `options`: (Optional) Configuration options
  - `variables`: Variables to inject into the script
  - `cwd`: Working directory path (defaults to file's directory)

### run()

Executes an AppleScript command in fire-and-forget mode. The command continues running even if the Node.js process crashes.

```typescript
function run(
  script: string,
  options?: OsaScriptOptions
): void
```

#### Parameters

- `script`: The AppleScript command to execute
- `options`: (Optional) Configuration options
  - `variables`: Variables to inject into the script
  - `cwd`: Working directory path

### Types

```typescript
interface OsaScriptOptions {
  variables?: Record<string, unknown>;
  cwd?: string;
}

class OsaScriptError extends Error {
  readonly stderr?: string;
  readonly code?: number;
}
```

## Common Use Cases

### System Dialogs

```typescript
import { execute } from '@7c/osascript';

async function saveDialog() {
  try {
    const result = await execute(`
      display dialog "Save changes?" ¬
        buttons {"Don't Save", "Cancel", "Save"} ¬
        default button "Save" ¬
        cancel button "Cancel" ¬
        with icon caution
    `);
    console.log('User chose:', result);
  } catch (error) {
    console.error('Dialog failed:', error);
  }
}
```

### System Notifications

```typescript
import { run } from '@7c/osascript';

run(`
  display notification "Download complete" ¬
    with title "Downloader" ¬
    subtitle "File saved" ¬
    sound name "Glass"
`);
```

### Application Control

```typescript
import { execute } from '@7c/osascript';

async function toggleMusic() {
  try {
    await execute(`
      tell application "Music"
        if player state is playing then
          pause
        else
          play
        end if
      end tell
    `);
  } catch (error) {
    console.error('Failed to control Music app:', error);
  }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits
This is a TypeScript rewrite of [node-osascript](https://github.com/FWeinb/node-osascript) with modern Promise support and enhanced TypeScript features.
