"""
SMP ISLAM WALISONGO 2 DEPOK - Unified Local Server Launcher
Menjalankan Backend Python FastAPI (Port 8000) dan Frontend Next.js (Port 3000) sekaligus secara terpadu.

Cara Penggunaan:
  python run.py               -> Menjalankan Frontend (Next.js) & Backend (FastAPI) bersamaan
  python run.py --backend-only -> Menjalankan Backend FastAPI saja (Headless / API mode)
"""
import os
import sys
import time
import signal
import subprocess
import shutil
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
BACKEND_PORT = 8000
FRONTEND_PORT = 3000

def is_service_ready(url, timeout=1):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as response:
            return response.status == 200
    except Exception:
        return False

def main():
    backend_only = "--backend-only" in sys.argv

    print("\033[96m" + "=" * 65 + "\033[0m")
    print("\033[92m" + "  ✨ SMP ISLAM WALISONGO 2 DEPOK - UNIFIED SERVER LAUNCHER ✨" + "\033[0m")
    print("\033[96m" + "=" * 65 + "\033[0m")

    # If backend-only is requested, run uvicorn directly in main thread
    if backend_only:
        print(f"\033[94m⚡ Mode API Backend: Menjalankan FastAPI di http://127.0.0.1:{BACKEND_PORT}\033[0m")
        import uvicorn
        uvicorn.run("api.index:app", host="0.0.0.0", port=BACKEND_PORT, reload=True)
        return

    # 1. Start Python FastAPI in subprocess
    python_bin = sys.executable
    print(f"\033[94m⚡ [1/2] Menyiapkan Backend FastAPI (Python) di port {BACKEND_PORT}...\033[0m")

    # Check if backend is already running
    backend_proc = None
    if is_service_ready(f"http://127.0.0.1:{BACKEND_PORT}/api/info"):
        print(f"\033[92m✓ Backend FastAPI sudah aktif di port {BACKEND_PORT}\033[0m")
    else:
        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        backend_proc = subprocess.Popen(
            [python_bin, "-m", "uvicorn", "api.index:app", "--host", "127.0.0.1", "--port", str(BACKEND_PORT), "--reload"],
            cwd=str(BASE_DIR),
            env=env
        )

        # Wait for FastAPI health check
        ready = False
        for _ in range(25):
            time.sleep(0.4)
            if is_service_ready(f"http://127.0.0.1:{BACKEND_PORT}/api/info"):
                ready = True
                print(f"\033[92m✓ Backend FastAPI siap melayani API di http://127.0.0.1:{BACKEND_PORT}\033[0m")
                break

        if not ready:
            print("\033[93m⚠️ Backend FastAPI masih inisialisasi, melanjutkan...\033[0m")

    # 2. Check Node / Next.js
    npx_bin = shutil.which("npx") or "npx"
    next_cli = BASE_DIR / "node_modules" / ".bin" / "next"

    print(f"\033[95m⚡ [2/2] Menjalankan Frontend Next.js di port {FRONTEND_PORT}...\033[0m")
    print(f"\033[96m  🔗 Portal Website Utama : http://localhost:{FRONTEND_PORT}\033[0m")
    print(f"\033[96m  🔗 Backend REST API Docs: http://127.0.0.1:{BACKEND_PORT}/docs\033[0m")
    print(f"\033[96m  🔗 Mode Mobile App      : http://localhost:{FRONTEND_PORT}/app\033[0m")
    print("\033[96m" + "=" * 65 + "\033[0m\n")

    frontend_env = os.environ.copy()
    frontend_env["BACKEND_URL"] = f"http://127.0.0.1:{BACKEND_PORT}"

    if next_cli.exists():
        frontend_cmd = [str(next_cli), "dev", "-p", str(FRONTEND_PORT)]
    else:
        frontend_cmd = [npx_bin, "next", "dev", "-p", str(FRONTEND_PORT)]

    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(BASE_DIR),
        env=frontend_env
    )

    def shutdown_handler(sig, frame):
        print("\n\033[91m🛑 Menghentikan seluruh proses server development...\033[0m")
        if backend_proc and backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc and frontend_proc.poll() is None:
            frontend_proc.terminate()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown_handler)
    signal.signal(signal.SIGTERM, shutdown_handler)

    try:
        frontend_proc.wait()
    except KeyboardInterrupt:
        shutdown_handler(None, None)

if __name__ == "__main__":
    main()
