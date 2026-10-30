"""
Local runner script for SMP Islam Walisongo 2 Depok application.
Run with: python run.py
"""
import sys
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("✨ SMP ISLAM WALISONGO 2 DEPOK - PORTAL WEB & MOBILE ✨")
    print("Membuka server lokal pada http://localhost:8000")
    print("Mode Mobile App: http://localhost:8000/mobile")
    print("Portal PPDB Online: http://localhost:8000/ppdb")
    print("Portal Layanan Terpadu: http://localhost:8000/portal")
    print("Admin CMS Dashboard: http://localhost:8000/admin")
    print("Dokumentasi Swagger API: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("api.index:app", host="0.0.0.0", port=8000, reload=True)
