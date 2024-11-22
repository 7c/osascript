"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const osascript_1 = require("./osascript");
console.log('Starting crash demo...');
// This will show a dialog that will persist even after the Node.js process crashes
(0, osascript_1.run)(`
display dialog "Node.js process crashed!" with title "Error" buttons {"OK"} with icon stop default button "OK"
`);
// Simulate some work
console.log('Doing some work...');
setTimeout(() => {
    console.log('About to crash...');
    // Simulate a crash by throwing an error
    throw new Error('Simulated crash!');
}, 1000);
// This code will never run due to the crash
console.log('This will never be printed');
