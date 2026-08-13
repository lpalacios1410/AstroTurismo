import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, rmdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const astroBin = join(process.cwd(), 'node_modules', 'astro', 'astro.js');
const result = spawnSync(process.execPath, [astroBin, 'build'], {
  stdio: ['ignore', 'inherit', 'pipe'],
});

const dist = join(process.cwd(), 'dist');
const stderr = String(result.stderr ?? '');
const failed = result.status !== 0;
const builtOk = existsSync(join(dist, 'index.html'));

// Astro 5 on Windows (Node libuv) crashes at the very end when it prunes the
// now-empty dist/chunks and dist/pages dirs (EBUSY). The build itself succeeded.
const windowsCleanupQuirk = /removeEmptyDirs/.test(stderr) && /EBUSY/.test(stderr);

if (failed && builtOk && windowsCleanupQuirk) {
  for (const name of ['chunks', 'pages']) {
    const p = join(dist, name);
    try {
      if (statSync(p).isDirectory() && readdirSync(p).length === 0) {
        rmdirSync(p);
      }
    } catch {
      /* ignore */
    }
  }
  console.log('[build] Sitio generado correctamente. Limpieza de directorios vacios omitida (quirks de Windows).');
  process.exit(0);
}

process.exit(result.status ?? 1);
