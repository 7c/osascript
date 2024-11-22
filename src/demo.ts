import { execute } from './osascript';

async function main() {
  console.log('Starting demo...');
  console.log('Showing dialog...');

  try {
    // Using a script that returns just the button name
    const script = `
      set dialogResult to display dialog "What should I do?" ¬
        buttons {"Go home", "Work", "Nothing"} ¬
        default button "Nothing"
      return button returned of dialogResult
    `;

    const result = await execute(script);
    console.log('You clicked the button:', result);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main().catch(console.error);
