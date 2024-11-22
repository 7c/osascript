import { ExecFileException } from 'child_process';
type Callback = (error: ExecFileException | null, result?: string) => void;
type Variables = {
    [key: string]: any;
};
declare function execute(script: string, cb: Callback): void;
declare function execute(script: string, vars: Variables, cb: Callback): void;
declare function execute(path: string, script: string, cb: Callback): void;
declare function execute(path: string, script: string, vars: Variables, cb: Callback): void;
declare function run(script: string): void;
declare function run(script: string, vars: Variables): void;
declare function run(path: string, script: string): void;
declare function run(path: string, script: string, vars: Variables): void;
declare function serializeObject(value: any): string;
declare function generateVars(object: Variables): string;
declare function executeFile(path: string, cb: Callback): void;
declare function executeFile(path: string, vars: Variables, cb: Callback): void;
export { execute, executeFile, run, serializeObject, generateVars, Variables, Callback };
