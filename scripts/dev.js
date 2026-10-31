#!/usr/bin/env node
/**
 * Unified Local Development Server Launcher
 * Automatically orchestrates Python FastAPI (Backend) & Next.js (Frontend).
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const BACKEND_PORT = 8000;
const FRONTEND_PORT = 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to check if a local HTTP service is alive
function checkHealth(port, pathName = '/api/info') {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port: port,
        path: pathName,
        timeout: 1000,
      },
      (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════════════');
  console.log('\x1b[32m%s\x1b[0m', '  🚀 SMP ISLAM WALISONGO 2 DEPOK - UNIFIED DEV LAUNCHER');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════════════');

  let backendProc = null;
  const isBackendAlive = await checkHealth(BACKEND_PORT);

  if (isBackendAlive) {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `  ✓ [Backend] FastAPI terdeteksi sudah aktif di http://127.0.0.1:${BACKEND_PORT}`
    );
  } else {
    console.log(
      '\x1b[34m%s\x1b[0m',
      `  ⚡ [Backend] Menjalankan server Python FastAPI di port ${BACKEND_PORT}...`
    );

    // Locate Python binary (prefer virtualenv)
    const venvPython = path.join(ROOT_DIR, '.venv', 'bin', 'python');
    const venvPythonWin = path.join(ROOT_DIR, '.venv', 'Scripts', 'python.exe');
    let pythonCmd = 'python3';

    if (fs.existsSync(venvPython)) {
      pythonCmd = venvPython;
    } else if (fs.existsSync(venvPythonWin)) {
      pythonCmd = venvPythonWin;
    }

    backendProc = spawn(
      pythonCmd,
      ['-m', 'uvicorn', 'api.index:app', '--host', '127.0.0.1', '--port', `${BACKEND_PORT}`, '--reload'],
      {
        cwd: ROOT_DIR,
        stdio: ['inherit', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1',
        },
      }
    );

    backendProc.stdout.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          console.log('\x1b[34m[FastAPI]\x1b[0m %s', line);
        }
      }
    });

    backendProc.stderr.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          console.log('\x1b[33m[FastAPI]\x1b[0m %s', line);
        }
      }
    });

    // Wait for backend health check
    let ready = false;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 400));
      if (await checkHealth(BACKEND_PORT)) {
        ready = true;
        console.log(
          '\x1b[32m%s\x1b[0m',
          `  ✓ [Backend] FastAPI siap! API terhubung di http://127.0.0.1:${BACKEND_PORT}`
        );
        break;
      }
    }

    if (!ready) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        '  ⚠️ [Backend] FastAPI memakan waktu lebih lama untuk booting, melanjutkan ke frontend...'
      );
    }
  }

  console.log(
    '\x1b[35m%s\x1b[0m',
    `  ⚡ [Frontend] Menjalankan Next.js App Router di port ${FRONTEND_PORT}...`
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    `  🔗 URL Utama Website: http://localhost:${FRONTEND_PORT}`
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    `  🔗 Swagger API Docs : http://127.0.0.1:${BACKEND_PORT}/docs`
  );
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════════════\n');

  const nextBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'next');
  const frontendProc = spawn(nextBin, ['dev', '-p', `${FRONTEND_PORT}`], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      BACKEND_URL: `http://127.0.0.1:${BACKEND_PORT}`,
    },
  });

  const cleanup = () => {
    console.log('\n\x1b[31m%s\x1b[0m', '🛑 Menghentikan server development...');
    if (backendProc) {
      try {
        backendProc.kill('SIGINT');
      } catch {}
    }
    try {
      frontendProc.kill('SIGINT');
    } catch {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  frontendProc.on('close', (code) => {
    if (backendProc) {
      try {
        backendProc.kill('SIGINT');
      } catch {}
    }
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('Fatal error in dev script:', err);
  process.exit(1);
});
