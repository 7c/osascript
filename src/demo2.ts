import { run } from './osascript';

console.log('Starting crash demo...');

// This will show a dialog that will persist even after the Node.js process crashes
run(`
  display dialog "Node.js process crashed!" ¬
    with title "Error" ¬
    buttons {"OK"} ¬
    with icon stop ¬
    default button "OK"
`);

// Demonstrate error handling and process crash
async function simulateCrash() {
  console.log('Doing some work...');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('About to crash...');
  
  // Simulate a crash by throwing an error
  throw new Error('Simulated crash!');
}

// The dialog will remain visible even after this crashes
simulateCrash().catch(() => {
  process.exit(1);
});
