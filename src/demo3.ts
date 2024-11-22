import { execute, run, OsaScriptOptions } from './osascript';

async function main() {
  // Example with typed variables
  const options: OsaScriptOptions = {
    variables: {
      title: "TypeScript Demo",
      message: "This is a demo with typed variables",
      options: ["OK", "Cancel", "Help"],
      defaultButton: 1
    }
  };

  try {
    // Using execute with variables
    const result = await execute(`
      tell application "System Events"
        display dialog message ¬
          with title title ¬
          buttons options ¬
          default button (item defaultButton of options)
      end tell
    `, options);
    
    console.log('Dialog result:', result);

    // Using run with variables (fire and forget)
    run(`
      tell application "System Events"
        display notification message with title title
      end tell
    `, options);

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
