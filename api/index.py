"""
SMP ISLAM WALISONGO 2 DEPOK - Official Web & Mobile Application
Built with FastAPI & Python. Ready for local execution and seamless Vercel deployment.
"""
import os
import sys
import random
import time
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException, Form
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

# Ensure project root is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.database import get_db_connection, init_db
from backend.initial_data import seed_data
from backend.models import PPDBRegistrationCreate, PesanKontakCreate, RaportCheckRequest, AIQueryRequest
from backend.auth import (
    hash_password, verify_password, create_session_token,
    get_current_user, record_system_log, COOKIE_NAME, SESSION_DURATION_SECONDS
)
from backend.supabase_client import (
    is_supabase_enabled,
    supabase_insert_ppdb,
    supabase_get_ppdb,
    supabase_get_all_ppdb,
    supabase_update_ppdb_status,
    supabase_insert_pesan,
    supabase_get_all_pesan,
    supabase_get_raport,
    supabase_get_user,
    supabase_get_all_users,
    supabase_insert_user,
    supabase_update_user_password,
    supabase_update_user_last_login,
    supabase_insert_log,
    supabase_get_all_logs
)

# Initialize Database & Seed data if necessary
try:
    init_db()
    seed_data()
except Exception as e:
    print(f"Database init notice: {e}")

app = FastAPI(
    title="SMP Islam Walisongo 2 Depok - Portal Terpadu",
    description="Sistem Informasi Sekolah, Portal Layanan Terpadu & PPDB Online SMP Islam Walisongo 2 Depok",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip Compression for superfast payload transfer (< 500 bytes overhead)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Static & Templates setup
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Vercel Serverless Path Normalizer & Cache Optimizer Middleware
@app.middleware("http")
async def vercel_path_normalizer(request: Request, call_next):
    """
    On Vercel, catch-all rewrites direct traffic to /api/index.py?__path=/$1.
    This middleware restores the original requested path from the __path query parameter,
    Vercel headers, or falls back to /.
    Also injects optimal Cache-Control headers for static assets.
    """
    target_path = None

    # 1. Query parameter passed by Vercel rewrite (?__path=...)
    path_param = request.query_params.get("__path")
    if path_param:
        target_path = path_param if path_param.startswith("/") else f"/{path_param}"

    # 2. Header fallback
    if not target_path or target_path in ("/api/index.py", "/api/index.py/"):
        matched_path = request.headers.get("x-matched-path") or request.headers.get("x-forwarded-uri")
        if matched_path and not matched_path.startswith("/api/index.py"):
            target_path = matched_path.split("?")[0]

    # 3. Path cleanup
    if target_path:
        while target_path.startswith("//"):
            target_path = target_path[1:]
        request.scope["path"] = target_path
    else:
        current_path = request.scope.get("path", "")
        if current_path in ("/api/index.py", "/api"):
            request.scope["path"] = "/"
        elif current_path.startswith("/api/index.py/"):
            request.scope["path"] = current_path[len("/api/index.py"):]

    response = await call_next(request)

    # Performance: Enable Browser & Edge Caching for static assets (CSS, JS, SVG, Images)
    req_path = request.scope.get("path", "")
    if req_path.startswith("/static/") or req_path.endswith((".css", ".js", ".svg", ".png", ".jpg", ".woff2")):
        response.headers["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=604800"

    return response

# School Profile Static Metadata
SCHOOL_INFO = {
    "nama": "SMP Islam Walisongo 2 Depok",
    "npsn": "70043562",
    "akreditasi": "A (Unggul)",
    "status": "Swasta Berakreditasi A",
    "yayasan": "Yayasan Pondok Pesantren Hj. Dardjah Amin",
    "pimpinan_yayasan": "H. Achmad Baidhowi Hamzah / Ust. Imam Awaludin, S.Pd.",
    "kepala_sekolah": "Aida Suryaningsih, S.Pd.I",
    "alamat": "Jl. Cepit Raya, Kp. Sawah RT. 005 / RW. 002, Kelurahan Jatimulya, Kecamatan Cilodong, Kota Depok, Jawa Barat 16413",
    "telepon": "(021) 7782-4356",
    "whatsapp": "+62 812-9090-4356",
    "email": "info@smpiwalisongo2depok.sch.id",
    "jam_operasional": "Senin - Sabtu: 07.00 - 16.00 WIB",
    "visi": "Terwujudnya peserta didik yang beriman dan bertakwa, cerdas dalam iptek, terampil berkarya, serta berakhlakul karimah berlandaskan nilai-nilai Ahlussunnah wal Jama'ah.",
    "misi": [
        "Menanamkan pondasi akidah Islam yang kokoh, adab mulia, dan kecintaan pada Al-Qur'an melalui program Tahfidz intensif.",
        "Menyelenggarakan proses pembelajaran berkualitas berbasis Kurikulum Merdeka yang adaptif terhadap sains dan teknologi modern.",
        "Mengembangkan kecakapan literasi digital, penguasaan coding, robotika, serta bahasa asing (Arab & Inggris).",
        "Membina kedisiplinan, kemandirian, dan jiwa kepemimpinan santri melalui kepanduan Pramuka BRAVIA serta beragam ekstrakurikuler prestasi.",
        "Menciptakan lingkungan sekolah asri, agamis, ramah anak, dan kolaboratif dengan orang tua serta masyarakat."
    ],
    "program_unggulan": [
        {"title": "Tahfidzul Qur'an & Tilawah Bersanad", "desc": "Bimbingan hafalan Al-Qur'an tematik dengan target minimal 3 Juz disertai sanad makharijul huruf dan tajwid mutqin.", "icon": "quran"},
        {"title": "Digital Smart School & IT Club", "desc": "Laboratorium komputer mutakhir, pembelajaran coding, robotika dasar, desain digital, dan ujian berbasis CBT.", "icon": "laptop"},
        {"title": "Bilingual Speech Environment", "desc": "Pembiasaan percakapan dwi bahasa (Bahasa Arab & English) guna menyiapkan santri berdaya saing global.", "icon": "languages"},
        {"title": "Pramuka BRAVIA & Karakter Santri", "desc": "Gugus Depan berprestasi juara umum yang melatih survival skill, ketangguhan, kedisiplinan, dan jiwa ksatria.", "icon": "compass"},
        {"title": "Bimbingan Prestasi Sains & Olimpiade", "desc": "Klinik belajar intensif untuk persiapan Kompetisi Sains Madrasah (KSM) dan Olimpiade Sains Nasional (OSN).", "icon": "sparkles"}
    ],
    "fasilitas": [
        "Ruang Kelas Ber-AC & Dilengkapi Multimedia Proyektor",
        "Masjid & Aula Serbaguna Hj. Dardjah Amin",
        "Laboratorium Komputer & Digital Smart School",
        "Laboratorium IPA Terpadu & Eksperimen Sains",
        "Perpustakaan Digital (E-Library) & Pojok Literasi Santri",
        "Lapangan Olahraga Terpadu (Futsal, Basket, Voli)",
        "Studio Hadroh, Seni Musik & Podcast Kreatif Santri",
        "Kantin Sehat Higienis & Koperasi Sekolah",
        "UKS Terpadu dengan Tenaga Medis Bersertifikat",
        "Keamanan CCTV 24 Jam & Lingkungan Asri Terpadu"
    ]
}

# ==================== PAGE CONTROLLERS ====================

@app.get("/", response_class=HTMLResponse)
@app.get("/api", response_class=HTMLResponse)
@app.get("/api/index.py", response_class=HTMLResponse)
async def home_page(request: Request):
    """Main Web Portal with stunning modern UI, responsive for all devices."""
    conn = get_db_connection()
    berita_list = conn.execute("SELECT * FROM berita ORDER BY id DESC LIMIT 4").fetchall()
    guru_list = conn.execute("SELECT * FROM guru ORDER BY urutan ASC LIMIT 6").fetchall()
    ekskul_list = conn.execute("SELECT * FROM ekskul ORDER BY id ASC").fetchall()
    testimoni_list = conn.execute("SELECT * FROM testimoni ORDER BY id ASC").fetchall()
    conn.close()

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "school": SCHOOL_INFO,
            "berita_list": [dict(b) for b in berita_list],
            "guru_list": [dict(g) for g in guru_list],
            "ekskul_list": [dict(e) for e in ekskul_list],
            "testimoni_list": [dict(t) for t in testimoni_list],
            "active_page": "beranda"
        }
    )

@app.get("/mobile", response_class=HTMLResponse)
async def mobile_app_view(request: Request):
    """Dedicated Mobile App Interface / PWA Native Simulation View."""
    conn = get_db_connection()
    berita_list = conn.execute("SELECT * FROM berita ORDER BY id DESC LIMIT 5").fetchall()
    ekskul_list = conn.execute("SELECT * FROM ekskul ORDER BY id ASC LIMIT 6").fetchall()
    conn.close()

    return templates.TemplateResponse(
        request=request,
        name="mobile_app.html",
        context={
            "school": SCHOOL_INFO,
            "berita_list": [dict(b) for b in berita_list],
            "ekskul_list": [dict(e) for e in ekskul_list],
            "active_page": "mobile"
        }
    )

@app.get("/profil", response_class=HTMLResponse)
async def profile_page(request: Request):
    """Detailed School Profile, History, Vision-Mission, Teachers & Facilities."""
    conn = get_db_connection()
    guru_list = conn.execute("SELECT * FROM guru ORDER BY urutan ASC").fetchall()
    conn.close()

    return templates.TemplateResponse(
        request=request,
        name="profil.html",
        context={
            "school": SCHOOL_INFO,
            "guru_list": [dict(g) for g in guru_list],
            "active_page": "profil"
        }
    )

@app.get("/ppdb", response_class=HTMLResponse)
async def ppdb_page(request: Request):
    """Dedicated PPDB Online Registration, Requirement Guide, and Status Tracking."""
    return templates.TemplateResponse(
        request=request,
        name="ppdb.html",
        context={
            "school": SCHOOL_INFO,
            "active_page": "ppdb"
        }
    )

@app.get("/portal", response_class=HTMLResponse)
async def portal_page(request: Request):
    """Integrated Portal Services: SIAKAD, CBT, E-Library, Raport Check, SPP Calculator."""
    return templates.TemplateResponse(
        request=request,
        name="portal.html",
        context={
            "school": SCHOOL_INFO,
            "active_page": "portal"
        }
    )

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Login Portal for Master and Admin accounts."""
    user = get_current_user(request)
    if user:
        if user.get("role") == "master":
            return RedirectResponse(url="/admin/master", status_code=303)
        return RedirectResponse(url="/admin", status_code=303)
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={
            "school": SCHOOL_INFO,
            "active_page": "login"
        }
    )

@app.post("/api/auth/login")
async def api_auth_login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...)
):
    """Authenticate Master or Admin credentials and issue secure session cookie."""
    clean_username = username.strip().lower()
    user_row = None

    # 1. Try Cloud Supabase if active
    if is_supabase_enabled():
        sb_user = supabase_get_user(clean_username)
        if sb_user:
            user_row = sb_user

    # 2. SQLite local/serverless fallback
    if not user_row:
        conn = get_db_connection()
        db_res = conn.execute(
            "SELECT * FROM users WHERE username = ? AND is_active = 1",
            (clean_username,)
        ).fetchone()
        if db_res:
            user_row = dict(db_res)
        conn.close()

    if not user_row or not verify_password(password, user_row["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Nama pengguna (username) atau kata sandi tidak sesuai. Silakan periksa kembali."
        )

    # Update last login timestamp in both
    if is_supabase_enabled():
        supabase_update_user_last_login(user_row["id"])
    try:
        conn = get_db_connection()
        conn.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (user_row["id"],))
        conn.commit()
        conn.close()
    except Exception:
        pass

    # Record Audit Trail Log
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "127.0.0.1").split(",")[0].strip()
    record_system_log(
        action="LOGIN_SUCCESS",
        detail=f"Pengguna '{user_row['username']}' ({user_row['role'].upper()}) berhasil login ke sistem.",
        username=user_row["username"],
        user_id=user_row["id"],
        ip_address=client_ip
    )

    token = create_session_token(
        user_id=user_row["id"],
        username=user_row["username"],
        role=user_row["role"],
        nama_lengkap=user_row["nama_lengkap"]
    )

    response = JSONResponse({
        "status": "success",
        "message": "Login berhasil! Selamat datang di Portal Manajemen.",
        "user": {
            "id": user_row["id"],
            "username": user_row["username"],
            "role": user_row["role"],
            "nama_lengkap": user_row["nama_lengkap"],
            "email": user_row.get("email")
        }
    })

    # Set secure HttpOnly session cookie
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=SESSION_DURATION_SECONDS,
        httponly=True,
        samesite="lax",
        secure=False
    )
    return response

@app.get("/logout")
@app.post("/api/auth/logout")
async def api_auth_logout(request: Request):
    """Sign out user and revoke session cookie."""
    user = get_current_user(request)
    if user:
        client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "127.0.0.1").split(",")[0].strip()
        record_system_log(
            action="LOGOUT",
            detail=f"Pengguna '{user['username']}' keluar dari sistem.",
            username=user["username"],
            user_id=user["id"],
            ip_address=client_ip
        )
    response = RedirectResponse(url="/login?notice=logged_out", status_code=303)
    response.delete_cookie(key=COOKIE_NAME)
    return response

@app.get("/api/auth/me")
async def api_auth_me(request: Request):
    """Return profile of currently authenticated user."""
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Sesi login tidak ditemukan atau telah kedaluwarsa.")
    return {"status": "success", "user": user}

@app.get("/admin", response_class=HTMLResponse)
async def admin_page(request: Request):
    """Admin CMS Dashboard (School CMS & PPDB Operations)."""
    user = get_current_user(request)
    if not user:
        return RedirectResponse(url="/login?notice=silakan_login&redirect=/admin", status_code=303)

    return templates.TemplateResponse(
        request=request,
        name="admin.html",
        context={
            "school": SCHOOL_INFO,
            "active_page": "admin",
            "user": user
        }
    )

@app.get("/admin/master", response_class=HTMLResponse)
async def admin_master_page(request: Request):
    """Master Authority Console: Role Management, User Directory & System Audit Logs."""
    user = get_current_user(request)
    if not user:
        return RedirectResponse(url="/login?notice=silakan_login&redirect=/admin/master", status_code=303)
    if user.get("role") != "master":
        return RedirectResponse(url="/admin?notice=unauthorized_master", status_code=303)

    all_users = []
    if is_supabase_enabled():
        sb_users = supabase_get_all_users()
        if sb_users:
            all_users = sb_users
    if not all_users:
        conn = get_db_connection()
        user_rows = conn.execute(
            "SELECT id, username, nama_lengkap, role, email, is_active, created_at, last_login FROM users ORDER BY id ASC"
        ).fetchall()
        all_users = [dict(u) for u in user_rows]
        conn.close()

    all_logs = []
    if is_supabase_enabled():
        sb_logs = supabase_get_all_logs(limit=100)
        if sb_logs:
            all_logs = sb_logs
    if not all_logs:
        try:
            conn = get_db_connection()
            log_rows = conn.execute(
                "SELECT id, user_id, username, action, detail, ip_address, created_at FROM system_logs ORDER BY id DESC LIMIT 100"
            ).fetchall()
            all_logs = [dict(l) for l in log_rows]
            conn.close()
        except Exception:
            pass

    return templates.TemplateResponse(
        request=request,
        name="admin_master.html",
        context={
            "school": SCHOOL_INFO,
            "active_page": "admin_master",
            "user": user,
            "all_users": all_users,
            "all_logs": all_logs
        }
    )


# ==================== REST API ENDPOINTS ====================

@app.get("/api/info")
async def api_school_info():
    """Get complete school profile metadata."""
    return {"status": "success", "data": SCHOOL_INFO}

@app.get("/api/debug-headers")
async def debug_headers(request: Request):
    return {
        "path": request.scope.get("path"),
        "headers": {k: v for k, v in request.headers.items() if any(w in k.lower() for w in ["matched", "uri", "forward", "url", "path", "route"])}
    }

@app.get("/api/berita")
async def api_get_berita(kategori: str = None):
    """Get news and announcements."""
    conn = get_db_connection()
    if kategori and kategori != "Semua":
        rows = conn.execute("SELECT * FROM berita WHERE kategori = ? ORDER BY id DESC", (kategori,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM berita ORDER BY id DESC").fetchall()
    conn.close()
    return {"status": "success", "total": len(rows), "data": [dict(r) for r in rows]}

@app.get("/api/berita/{id_or_slug}")
async def api_get_berita_detail(id_or_slug: str):
    """Get single article by ID or slug."""
    conn = get_db_connection()
    if id_or_slug.isdigit():
        row = conn.execute("SELECT * FROM berita WHERE id = ?", (int(id_or_slug),)).fetchone()
    else:
        row = conn.execute("SELECT * FROM berita WHERE slug = ?", (id_or_slug,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return {"status": "success", "data": dict(row)}

@app.get("/api/guru")
async def api_get_guru():
    """Get list of teachers and staff."""
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM guru ORDER BY urutan ASC").fetchall()
    conn.close()
    return {"status": "success", "data": [dict(r) for r in rows]}

@app.get("/api/ekskul")
async def api_get_ekskul():
    """Get extracurriculars."""
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM ekskul ORDER BY id ASC").fetchall()
    conn.close()
    return {"status": "success", "data": [dict(r) for r in rows]}

@app.get("/api/testimoni")
async def api_get_testimoni():
    """Get student and parent testimonials."""
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM testimoni ORDER BY id ASC").fetchall()
    conn.close()
    return {"status": "success", "data": [dict(r) for r in rows]}

# PPDB Endpoints
@app.post("/api/ppdb/register")
async def api_ppdb_register(data: PPDBRegistrationCreate):
    """Submit a new PPDB Online application with Supabase Cloud & SQLite dual-sync."""
    conn = get_db_connection()
    cursor = conn.cursor()

    random_num = random.randint(100, 999)
    timestamp_suffix = str(int(time.time()))[-3:]
    nomor_registrasi = f"REG-2026-WS{timestamp_suffix}{random_num}"

    payload_dict = {
        "nomor_registrasi": nomor_registrasi,
        "nama_lengkap": data.nama_lengkap.strip(),
        "nisn": data.nisn.strip(),
        "nik": data.nik.strip() if data.nik else "",
        "jenis_kelamin": data.jenis_kelamin,
        "tempat_lahir": data.tempat_lahir or "",
        "tanggal_lahir": data.tanggal_lahir or "",
        "asal_sekolah": data.asal_sekolah.strip(),
        "nama_wali": data.nama_wali.strip(),
        "no_wa_wali": data.no_wa_wali.strip(),
        "alamat_lengkap": data.alamat_lengkap or "",
        "jalur_pendaftaran": data.jalur_pendaftaran,
        "pilihan_peminatan": data.pilihan_peminatan or "Reguler & Tahfidz",
        "status_seleksi": "Menunggu Verifikasi Berkas",
        "catatan": "Pendaftaran daring berhasil diterima sistem. Silakan simpan nomor registrasi ini."
    }

    # 1. Save to Supabase Cloud if enabled
    supabase_record = None
    if is_supabase_enabled():
        supabase_record = supabase_insert_ppdb(payload_dict)

    # 2. Save to SQLite (always keep local/serverless fallback)
    try:
        cursor.execute("""
        INSERT INTO ppdb_pendaftar (
            nomor_registrasi, nama_lengkap, nisn, nik, jenis_kelamin,
            tempat_lahir, tanggal_lahir, asal_sekolah, nama_wali,
            no_wa_wali, alamat_lengkap, jalur_pendaftaran, pilihan_peminatan,
            status_seleksi, catatan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            nomor_registrasi,
            payload_dict["nama_lengkap"],
            payload_dict["nisn"],
            payload_dict["nik"],
            payload_dict["jenis_kelamin"],
            payload_dict["tempat_lahir"],
            payload_dict["tanggal_lahir"],
            payload_dict["asal_sekolah"],
            payload_dict["nama_wali"],
            payload_dict["no_wa_wali"],
            payload_dict["alamat_lengkap"],
            payload_dict["jalur_pendaftaran"],
            payload_dict["pilihan_peminatan"],
            payload_dict["status_seleksi"],
            payload_dict["catatan"]
        ))
        conn.commit()
    except Exception as e:
        if not supabase_record:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Gagal memproses pendaftaran: {str(e)}")

    row = cursor.execute("SELECT * FROM ppdb_pendaftar WHERE nomor_registrasi = ?", (nomor_registrasi,)).fetchone()
    conn.close()

    final_data = supabase_record if supabase_record else (dict(row) if row else payload_dict)

    return {
        "status": "success",
        "message": "Pendaftaran PPDB berhasil tersimpan!",
        "nomor_registrasi": nomor_registrasi,
        "storage": "supabase_cloud" if supabase_record else "sqlite",
        "data": final_data
    }

@app.get("/api/ppdb/check/{query}")
async def api_ppdb_check(query: str):
    """Check PPDB status with Supabase priority and SQLite fallback."""
    q = query.strip()

    # 1. Try Supabase first if enabled
    if is_supabase_enabled():
        sb_data = supabase_get_ppdb(q)
        if sb_data:
            return {"status": "success", "storage": "supabase_cloud", "data": sb_data}

    # 2. Fallback to SQLite
    conn = get_db_connection()
    row = conn.execute("""
    SELECT * FROM ppdb_pendaftar 
    WHERE UPPER(nomor_registrasi) = UPPER(?) OR nisn = ?
    """, (q, q)).fetchone()
    conn.close()

    if not row:
        return {
            "status": "not_found",
            "message": f"Data pendaftaran dengan kata kunci '{query}' tidak ditemukan. Pastikan Nomor Registrasi atau NISN sudah sesuai."
        }
    return {
        "status": "success",
        "storage": "sqlite",
        "data": dict(row)
    }

@app.get("/api/ppdb/stats")
async def api_ppdb_stats():
    """Get summary statistics of PPDB applicants."""
    total = 0
    diterima = 0
    verifikasi = 0

    if is_supabase_enabled():
        sb_list = supabase_get_all_ppdb()
        if sb_list is not None:
            total = len(sb_list)
            diterima = sum(1 for item in sb_list if "diterima" in item.get("status_seleksi", "").lower())
            verifikasi = sum(1 for item in sb_list if "verifikasi" in item.get("status_seleksi", "").lower())

    if total == 0:
        conn = get_db_connection()
        total = conn.execute("SELECT COUNT(*) FROM ppdb_pendaftar").fetchone()[0]
        diterima = conn.execute("SELECT COUNT(*) FROM ppdb_pendaftar WHERE status_seleksi LIKE '%Diterima%'").fetchone()[0]
        verifikasi = conn.execute("SELECT COUNT(*) FROM ppdb_pendaftar WHERE status_seleksi LIKE '%Verifikasi%'").fetchone()[0]
        conn.close()

    return {
        "status": "success",
        "total_pendaftar": total,
        "diterima": diterima,
        "dalam_proses": verifikasi,
        "kuota_total": 120,
        "sisa_kuota": max(0, 120 - diterima)
    }

# Academic Report / Raport Lookup
@app.post("/api/raport/check")
async def api_raport_check(data: RaportCheckRequest):
    """Check student report & graduation verification with Supabase & SQLite fallback."""
    nisn_clean = data.nisn.strip()

    if is_supabase_enabled():
        sb_raport = supabase_get_raport(nisn_clean)
        if sb_raport:
            return {"status": "success", "storage": "supabase_cloud", "data": sb_raport}

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM siswa_raport WHERE nisn = ?", (nisn_clean,)).fetchone()
    conn.close()

    if not row:
        return {
            "status": "not_found",
            "message": f"Data NISN '{data.nisn}' tidak ditemukan. Anda dapat mencoba NISN contoh: 0091234567 atau 0089876543."
        }
    return {
        "status": "success",
        "storage": "sqlite",
        "data": dict(row)
    }

# Contact & Consultation
@app.post("/api/kontak")
async def api_kirim_pesan(data: PesanKontakCreate):
    """Submit contact or consultation form."""
    msg_dict = {
        "nama": data.nama.strip(),
        "email": data.email.strip() if data.email else "",
        "no_whatsapp": data.no_whatsapp.strip(),
        "kategori": data.kategori,
        "subjek": data.subjek.strip(),
        "pesan": data.pesan.strip(),
        "status": "Belum Dibaca"
    }

    if is_supabase_enabled():
        supabase_insert_pesan(msg_dict)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO pesan_kontak (nama, email, no_whatsapp, kategori, subjek, pesan)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        msg_dict["nama"],
        msg_dict["email"],
        msg_dict["no_whatsapp"],
        msg_dict["kategori"],
        msg_dict["subjek"],
        msg_dict["pesan"]
    ))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Pesan Anda telah berhasil dikirim ke Humas SMP Islam Walisongo 2 Depok. Tim kami akan segera merespons via WhatsApp."
    }

# AI Smart Assistant Chatbot
@app.post("/api/ai/ask")
async def api_ai_ask(query: AIQueryRequest):
    """
    Intelligent Assistant for SMP Islam Walisongo 2 Depok.
    Answers prospective parents and students based on verified institutional knowledge.
    """
    q = query.pertanyaan.lower().strip()

    # Knowledge response logic
    if any(k in q for k in ["biaya", "spp", "uang", "bayar", "tarif", "beasiswa", "pembayaran"]):
        answer = (
            "Assalamu'alaikum Warahmatullahi Wabarakatuh. ✨\n\n"
            "Informasi Pembiayaan di SMP Islam Walisongo 2 Depok (Tahun Ajaran 2026/2027):\n"
            "• Formulir Pendaftaran Online: GRATIS (Rp 0,-\n"
            "• Uang Pangkal / Sarana Prasarana: Rp 3.500.000 (Dapat dicicil hingga 3x)\n"
            "• SPP Bulanan: Rp 350.000 / bulan (Sudah termasuk program Tahfidz harian & akses Lab IT)\n"
            "• Seragam Lengkap (5 Stel Termasuk Seragam Pramuka BRAVIA & Olahraga): Rp 950.000\n\n"
            "⭐ PROGRAM BEASISWA KHUSUS:\n"
            "1. Beasiswa Tahfidz: Bebas Uang Pangkal 100% untuk penghafal minimal 2 Juz Al-Qur'an.\n"
            "2. Beasiswa Prestasi Juara OSN/Lomba Tingkat Kota: Potongan SPP 50% selama 1 tahun.\n\n"
            "Ayah/Bunda dapat melakukan pendaftaran langsung melalui menu PPDB Online di website ini!"
        )
    elif any(k in q for k in ["syarat", "persyaratan", "berkas", "dokumen", "daftar"]):
        answer = (
            "Syarat Pendaftaran PPDB SMP Islam Walisongo 2 Depok:\n\n"
            "1. Mengisi formulir pendaftaran daring di menu PPDB Online.\n"
            "2. Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SD/MI yang telah dilegalisir (2 lembar).\n"
            "3. Fotokopi Akta Kelahiran calon peserta didik (2 lembar).\n"
            "4. Fotokopi Kartu Keluarga (KK) & KTP Orang Tua / Wali (2 lembar).\n"
            "5. Pas foto formal terbaru ukuran 3x4 berwarna (3 lembar, latar merah/biru).\n"
            "6. Fotokopi Sertifikat Prestasi / Piagam Hafalan Tahfidz (Bagi jalur beasiswa/prestasi).\n\n"
            "Semua berkas dapat diunggah secara digital saat pengisian formulir atau diserahkan langsung saat wawancara."
        )
    elif any(k in q for k in ["tahfidz", "quran", "qur'an", "hafalan", "khotmil"]):
        answer = (
            "Program Tahfidzul Qur'an di SMP Islam Walisongo 2 Depok:\n\n"
            "• Target Lulusan: Minimal hafal Juz 30 dan Juz pilihan (Juz 1, 29, Surah Al-Kahfi, Yasin, Al-Mulk, Ar-Rahman, Al-Waqiah).\n"
            "• Metode: Talaqqi dan Musyafahah langsung dibimbing Asatidz Al-Hafidz bersanad.\n"
            "• Jam Pembiasaan: Setiap pagi sebelum KBM reguler dimulai (One Day One Maqra') dan muroja'ah ba'da dzuhur/ashar.\n"
            "• Khotmil Qur'an Tematik: Diadakan berkala bersama Yayasan Pondok Pesantren Hj. Dardjah Amin."
        )
    elif any(k in q for k in ["alamat", "lokasi", "tempat", "dimana", "daerah"]):
        answer = (
            f"📍 Lokasi Kampus SMP Islam Walisongo 2 Depok:\n\n"
            f"{SCHOOL_INFO['alamat']}\n"
            f"Patokan: Dekat Jl. Raya Bogor KM 35 Cilodong & kawasan Jatimulya Kp. Sawah Depok.\n"
            f"Hotline WhatsApp: {SCHOOL_INFO['whatsapp']}\n\n"
            f"Kami mengundang Bapak/Ibu untuk berkunjung langsung melihat fasilitas laboratorium komputer, aula, masjid pesantren, dan lingkungan belajar kami."
        )
    elif any(k in q for k in ["ekskul", "ekstrakurikuler", "pramuka", "bravia", "kegiatan", "robotik", "coding"]):
        answer = (
            "Ekstrakurikuler Unggulan di SMP Islam Walisongo 2 Depok:\n\n"
            "1. Pramuka BRAVIA (Barisan Pramuka Walisongo 2) - Juara Umum LT Kwarran Cilodong.\n"
            "2. IT Club & Robotika (Belajar Coding Web, Logic Scratch, Perakitan Microcontroller).\n"
            "3. Hadroh & Marawis El-Walisongo (Seni Musik Rebana Islami).\n"
            "4. Tahfidz & Tilawah Maqamat (Seni Baca Al-Qur'an).\n"
            "5. Silat Prestasi IPSI (Pencak Silat Tradisional & Prestasi).\n"
            "6. English & Arabic Speech Club (Public Speaking dua bahasa).\n"
            "7. Futsal & Basket Walisongo Warrior.\n"
            "8. PMR (Palang Merah Remaja) & Paskibraka Sekolah."
        )
    elif any(k in q for k in ["kurikulum", "belajar", "merdeka", "pelajaran"]):
        answer = (
            "Kurikulum Pendidikan SMP Islam Walisongo 2 Depok:\n\n"
            "Sekolah kami mengimplementasikan KURIKULUM MERDEKA yang disempurnakan dengan Integrasi Nilai Islam Aswaja (Ahlussunnah wal Jama'ah):\n"
            "• Mata Pelajaran Umum Nasional: Matematika, IPA Terpadu, Bahasa Indonesia, Bahasa Inggris, IPS, Informatika/Koding, PPKn, PJOK.\n"
            "• Keagamaan Mendalam: Pendidikan Agama Islam, Fiqih, Aqidah Akhlak, Sejarah Kebudayaan Islam, Bahasa Arab, dan Tahfidz Qur'an.\n"
            "• Project P5 (Projek Penguatan Profil Pelajar Pancasila): Mengusung tema Kewirausahaan Digital Santri dan Kearifan Lokal."
        )
    elif any(k in q for k in ["halo", "hai", "assalamu", "selamat"]):
        answer = (
            "Assalamu'alaikum Warahmatullahi Wabarakatuh! Selamat datang di Layanan Informasi Cerdas SMP Islam Walisongo 2 Depok. 😊\n\n"
            "Saya Asisten Virtual Sekolah siap membantu Anda. Anda dapat menanyakan tentang:\n"
            "1. Informasi PPDB Online & Kuota Pendaftaran 2026/2027\n"
            "2. Rincian Biaya SPP & Beasiswa Tahfidz\n"
            "3. Syarat dan Alur Pendaftaran Siswa Baru\n"
            "4. Program Ekstrakurikuler & Prestasi Pramuka BRAVIA\n"
            "5. Alamat & Kontak Resmi Panitia\n\n"
            "Ada hal spesifik yang ingin Anda ketahui?"
        )
    else:
        answer = (
            f"Terima kasih atas pertanyaan Anda mengenai SMP Islam Walisongo 2 Depok.\n\n"
            f"Untuk informasi lebih terperinci mengenai '{query.pertanyaan}', silakan hubungi tim Humas & Panitia PPDB kami langsung melalui WhatsApp di {SCHOOL_INFO['whatsapp']} atau telepon di {SCHOOL_INFO['telepon']}. "
            f"Anda juga dapat mengisi formulir pesan pada menu Kontak kami!"
        )

    return {
        "status": "success",
        "pertanyaan": query.pertanyaan,
        "jawaban": answer
    }

# Admin CMS Endpoints
@app.get("/api/admin/overview")
async def api_admin_overview():
    """Get high-level summary for Admin CMS."""
    conn = get_db_connection()
    total_ppdb = conn.execute("SELECT COUNT(*) FROM ppdb_pendaftar").fetchone()[0]
    total_berita = conn.execute("SELECT COUNT(*) FROM berita").fetchone()[0]
    total_guru = conn.execute("SELECT COUNT(*) FROM guru").fetchone()[0]
    total_pesan = conn.execute("SELECT COUNT(*) FROM pesan_kontak").fetchone()[0]
    pesan_baru = conn.execute("SELECT COUNT(*) FROM pesan_kontak WHERE status = 'Belum Dibaca'").fetchone()[0]

    recent_ppdb = conn.execute("SELECT * FROM ppdb_pendaftar ORDER BY id DESC LIMIT 5").fetchall()
    recent_pesan = conn.execute("SELECT * FROM pesan_kontak ORDER BY id DESC LIMIT 5").fetchall()
    conn.close()

    # If Supabase enabled, merge cloud records
    if is_supabase_enabled():
        sb_ppdb = supabase_get_all_ppdb()
        sb_pesan = supabase_get_all_pesan()
        if sb_ppdb is not None:
            total_ppdb = len(sb_ppdb)
            recent_ppdb = sb_ppdb[:5]
        if sb_pesan is not None:
            total_pesan = len(sb_pesan)
            recent_pesan = sb_pesan[:5]

    return {
        "status": "success",
        "storage": "supabase_cloud" if is_supabase_enabled() else "sqlite",
        "stats": {
            "total_ppdb": total_ppdb,
            "total_berita": total_berita,
            "total_guru": total_guru,
            "total_pesan": total_pesan,
            "pesan_baru": pesan_baru
        },
        "recent_ppdb": [dict(r) if isinstance(r, dict) else dict(r) for r in recent_ppdb],
        "recent_pesan": [dict(p) if isinstance(p, dict) else dict(p) for p in recent_pesan]
    }

@app.get("/api/admin/ppdb-all")
async def api_admin_ppdb_all():
    """Fetch all PPDB applicants for admin view."""
    if is_supabase_enabled():
        sb_list = supabase_get_all_ppdb()
        if sb_list is not None:
            return {"status": "success", "storage": "supabase_cloud", "data": sb_list}

    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM ppdb_pendaftar ORDER BY id DESC").fetchall()
    conn.close()
    return {"status": "success", "storage": "sqlite", "data": [dict(r) for r in rows]}

@app.post("/api/admin/ppdb-update-status")
async def api_admin_ppdb_update(
    request: Request,
    id: int = Form(...),
    status: str = Form(...),
    catatan: str = Form("")
):
    """Update selection status of a PPDB applicant."""
    if is_supabase_enabled():
        supabase_update_ppdb_status(id, status, catatan)

    conn = get_db_connection()
    conn.execute("""
    UPDATE ppdb_pendaftar 
    SET status_seleksi = ?, catatan = ? 
    WHERE id = ?
    """, (status, catatan, id))
    conn.commit()
    conn.close()

    # Record Audit Log
    current_user = get_current_user(request)
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "127.0.0.1").split(",")[0].strip()
    record_system_log(
        action="PPDB_STATUS_UPDATE",
        detail=f"Status pendaftar ID {id} diperbarui menjadi '{status}'. Catatan: {catatan or '-'}",
        username=current_user["username"] if current_user else "admin",
        user_id=current_user["id"] if current_user else None,
        ip_address=client_ip
    )

    return {"status": "success", "message": "Status calon siswa berhasil diperbarui"}

# ==================== MASTER ROLE: USER MANAGEMENT & AUDIT LOGS ====================

@app.get("/api/admin/logs")
async def api_admin_list_logs(request: Request):
    """Retrieve audit trail logs (Master-only)."""
    current_user = get_current_user(request)
    if not current_user or current_user["role"] != "master":
        raise HTTPException(status_code=403, detail="Hanya Akun Master yang memiliki otorisasi melihat log sistem.")

    logs = []
    if is_supabase_enabled():
        sb_logs = supabase_get_all_logs(limit=100)
        if sb_logs:
            logs = sb_logs
    if not logs:
        try:
            conn = get_db_connection()
            rows = conn.execute(
                "SELECT id, user_id, username, action, detail, ip_address, created_at FROM system_logs ORDER BY id DESC LIMIT 100"
            ).fetchall()
            logs = [dict(r) for r in rows]
            conn.close()
        except Exception:
            pass

    return {"status": "success", "data": logs}

@app.get("/api/admin/users")
async def api_admin_list_users(request: Request):
    """List all system users (Master-only)."""
    current_user = get_current_user(request)
    if not current_user or current_user["role"] != "master":
        raise HTTPException(status_code=403, detail="Hanya Akun Master yang memiliki otorisasi melihat data pengguna.")

    conn = get_db_connection()
    rows = conn.execute("""
    SELECT id, username, nama_lengkap, role, email, is_active, created_at, last_login 
    FROM users 
    ORDER BY id ASC
    """).fetchall()
    conn.close()
    return {"status": "success", "data": [dict(r) for r in rows]}

@app.post("/api/admin/users/create")
async def api_admin_create_user(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    nama_lengkap: str = Form(...),
    role: str = Form("admin"),
    email: str = Form("")
):
    """Create new admin/master account (Master-only)."""
    current_user = get_current_user(request)
    if not current_user or current_user["role"] != "master":
        raise HTTPException(status_code=403, detail="Hanya Akun Master yang berhak membuat akun baru.")

    clean_username = username.strip().lower()
    if len(clean_username) < 3:
        raise HTTPException(status_code=400, detail="Username minimal 3 karakter.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Kata sandi minimal 6 karakter.")

    conn = get_db_connection()
    exists = conn.execute("SELECT id FROM users WHERE username = ?", (clean_username,)).fetchone()
    if exists:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Username '{clean_username}' sudah digunakan.")

    hashed_pw = hash_password(password)
    user_payload = {
        "username": clean_username,
        "password_hash": hashed_pw,
        "nama_lengkap": nama_lengkap.strip(),
        "role": role,
        "email": email.strip(),
        "is_active": 1
    }

    if is_supabase_enabled():
        supabase_insert_user(user_payload)

    conn.execute("""
    INSERT INTO users (username, password_hash, nama_lengkap, role, email, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
    """, (clean_username, hashed_pw, nama_lengkap.strip(), role, email.strip()))
    conn.commit()
    conn.close()

    # Record Audit Log
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "127.0.0.1").split(",")[0].strip()
    record_system_log(
        action="USER_CREATED",
        detail=f"Akun baru dibuat: @{clean_username} ({nama_lengkap.strip()}) dengan role '{role.upper()}'.",
        username=current_user["username"],
        user_id=current_user["id"],
        ip_address=client_ip
    )

    return {"status": "success", "message": f"Akun '{clean_username}' ({role.upper()}) berhasil dibuat!"}

@app.post("/api/admin/users/reset-password")
async def api_admin_reset_password(
    request: Request,
    user_id: int = Form(...),
    new_password: str = Form(...)
):
    """Reset password for a user (Master-only)."""
    current_user = get_current_user(request)
    if not current_user or current_user["role"] != "master":
        raise HTTPException(status_code=403, detail="Hanya Akun Master yang dapat mereset kata sandi.")

    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Kata sandi baru minimal 6 karakter.")

    hashed_pw = hash_password(new_password)
    if is_supabase_enabled():
        supabase_update_user_password(user_id, hashed_pw)

    conn = get_db_connection()
    conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (hashed_pw, user_id))
    conn.commit()
    conn.close()

    # Record Audit Log
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "127.0.0.1").split(",")[0].strip()
    record_system_log(
        action="PASSWORD_RESET",
        detail=f"Kata sandi untuk akun pengguna ID {user_id} telah direset.",
        username=current_user["username"],
        user_id=current_user["id"],
        ip_address=client_ip
    )

    return {"status": "success", "message": "Kata sandi pengguna berhasil diperbarui!"}

# PWA Manifest & Service Worker
@app.get("/manifest.json")
async def get_manifest():
    manifest_path = STATIC_DIR / "manifest.json"
    if manifest_path.exists():
        return FileResponse(manifest_path, media_type="application/manifest+json")
    return JSONResponse({
        "name": "SMP Islam Walisongo 2 Depok",
        "short_name": "SMPI Walisongo 2",
        "start_url": "/mobile",
        "display": "standalone",
        "background_color": "#064e3b",
        "theme_color": "#064e3b"
    })

@app.get("/sw.js")
async def get_service_worker():
    sw_path = STATIC_DIR / "sw.js"
    if sw_path.exists():
        return FileResponse(sw_path, media_type="application/javascript")
    return HTMLResponse("/* Service Worker */", media_type="application/javascript")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.index:app", host="0.0.0.0", port=8000, reload=True)
