import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(__dirname, '..');
const distDir = join(backendRoot, 'dist', 'lambda');
const zipPath = join(backendRoot, 'dist', 'api-handler.zip');

rmSync(join(backendRoot, 'dist'), { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

writeFileSync(
  join(distDir, 'package.json'),
  JSON.stringify({ name: 'api-handler', type: 'module', main: 'index.js' }, null, 2)
);

cpSync(join(backendRoot, 'src'), join(distDir, 'src'), { recursive: true });

writeFileSync(
  join(distDir, 'index.js'),
  `export { handler } from './src/handlers/api.js';\n`
);

execSync('npm install --omit=dev', { cwd: distDir, stdio: 'inherit' });
rmSync(join(distDir, 'api-handler.zip'), { force: true });
execSync(`zip -r "${zipPath}" .`, { cwd: distDir, stdio: 'inherit' });

console.log(`Lambda package created: ${zipPath}`);
