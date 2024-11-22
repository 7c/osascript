"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const osascript_1 = require("./osascript");
console.log('Starting demo...');
console.log('Showing dialog...');
// Using a script that returns just the button name
const script = `
set dialogResult to display dialog "What should I do?" buttons {"Go home", "Work", "Nothing"} default button "Nothing"
return button returned of dialogResult
`;
(0, osascript_1.execute)(script, (err, result) => {
    console.log('Callback received!');
    if (err) {
        console.error('Error occurred:', err);
        return;
    }
    console.log('You clicked the button:', result);
});
