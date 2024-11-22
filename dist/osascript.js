"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
exports.executeFile = executeFile;
exports.run = run;
exports.serializeObject = serializeObject;
exports.generateVars = generateVars;
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_1 = require("fs");
function execute(path, script, vars, cb) {
    let finalPath;
    let finalScript;
    let finalVars = {};
    let finalCb;
    // Handle overloaded arguments
    if (typeof script === 'function') {
        finalScript = path;
        finalCb = script;
    }
    else if (typeof script === 'object') {
        finalScript = path;
        finalVars = script;
        finalCb = vars;
    }
    else if (typeof vars === 'function') {
        finalPath = path;
        finalScript = script;
        finalCb = vars;
    }
    else {
        finalPath = path;
        finalScript = script;
        finalVars = vars;
        finalCb = cb;
    }
    // Handle variables
    if (Object.keys(finalVars).length > 0) {
        finalScript = generateVars(finalVars) + finalScript;
    }
    const opts = finalPath ? { cwd: (0, path_1.dirname)(finalPath) } : {};
    (0, child_process_1.execFile)('osascript', ['-e', finalScript], opts, (error, stdout, stderr) => {
        if (error) {
            finalCb(error);
            return;
        }
        finalCb(null, stdout.trim());
    });
}
function run(path, script, vars) {
    let finalPath;
    let finalScript;
    let finalVars = {};
    // Handle overloaded arguments
    if (typeof script === 'undefined') {
        finalScript = path;
    }
    else if (typeof script === 'object') {
        finalScript = path;
        finalVars = script;
    }
    else {
        finalPath = path;
        finalScript = script;
        finalVars = vars || {};
    }
    // Handle variables
    if (Object.keys(finalVars).length > 0) {
        finalScript = generateVars(finalVars) + finalScript;
    }
    const opts = {
        detached: true,
        stdio: 'ignore',
        ...(finalPath ? { cwd: (0, path_1.dirname)(finalPath) } : {})
    };
    const child = (0, child_process_1.spawn)('osascript', ['-e', finalScript], opts);
    if (child.unref) {
        child.unref();
    }
}
function serializeObject(value) {
    if (value === null) {
        return '';
    }
    if (typeof value === 'string') {
        return `"${value}"`;
    }
    if (typeof value === 'undefined') {
        return 'null';
    }
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return '{' + value.map(serializeObject).join(',') + '}';
        }
        return '{' + Object.entries(value)
            .map(([key, val]) => `${key}:${serializeObject(val)}`)
            .join(',') + '}';
    }
    return String(value);
}
function generateVars(object) {
    return Object.entries(object)
        .map(([key, value]) => `set ${key} to ${serializeObject(value)}\n`)
        .join('');
}
function executeFile(path, vars, cb) {
    const finalCb = (typeof vars === 'function' ? vars : cb);
    const finalVars = typeof vars === 'function' ? {} : vars;
    const script = (0, fs_1.readFileSync)(path, 'utf8');
    execute(path, script, finalVars, finalCb);
}
