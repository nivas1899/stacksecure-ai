import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const processes = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const viteCliPath = resolve(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

const start = (name, command, args) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    cwd: projectRoot,
    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },
  });

  processes.push(child);

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });
};

const shutdown = (code = 0) => {
  processes.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });
  process.exit(code);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('api', 'node', ['server/index.js']);
start('web', process.execPath, [viteCliPath]);
