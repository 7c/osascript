"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const osascript_1 = require("./osascript");
// Example with typed variables
const variables = {
    title: "TypeScript Demo",
    message: "This is a demo with typed variables",
    options: ["OK", "Cancel", "Help"],
    defaultButton: 1
};
// Using execute with variables and type-safe callback
(0, osascript_1.execute)(`
tell application "System Events"
    display dialog message with title title buttons options default button (item defaultButton of options)
end tell
`, variables, (err, result) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Dialog result:', result);
});
// Using run with variables (fire and forget)
(0, osascript_1.run)(`
tell application "System Events"
    display notification message with title title
end tell
`, variables);
