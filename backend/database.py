"""
Database connection and session management for SMP Islam Walisongo 2 Depok.
Supports local persistent SQLite and serverless-safe fallback (e.g. /tmp for Vercel).
"""
import os
import sqlite3
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# In Vercel serverless environments, root filesystem might be read-only.
# We ensure the database path is writable by checking write permission or falling back to /tmp.
DEFAULT_DB_PATH = BASE_DIR / "walisongo.db"
SERVERLESS_DB_PATH = Path("/tmp/walisongo.db")

def get_db_path() -> Path:
    if os.environ.get("VERCEL"):
        # If running inside Vercel, use /tmp and copy bundled seed if needed
        if not SERVERLESS_DB_PATH.exists() and DEFAULT_DB_PATH.exists():
            try:
                shutil.copyfile(DEFAULT_DB_PATH, SERVERLESS_DB_PATH)
            except Exception:
                pass
        return SERVERLESS_DB_PATH
    return DEFAULT_DB_PATH

def get_db_connection():
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table: PPDB Pendaftaran
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ppdb_pendaftar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomor_registrasi TEXT UNIQUE NOT NULL,
        nama_lengkap TEXT NOT NULL,
        nisn TEXT NOT NULL,
        nik TEXT,
        jenis_kelamin TEXT NOT NULL,
        tempat_lahir TEXT,
        tanggal_lahir TEXT,
        asal_sekolah TEXT NOT NULL,
        nama_wali TEXT NOT NULL,
        no_wa_wali TEXT NOT NULL,
        alamat_lengkap TEXT,
        jalur_pendaftaran TEXT NOT NULL,
        pilihan_peminatan TEXT,
        status_seleksi TEXT DEFAULT 'Menunggu Verifikasi',
        catatan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Table: Berita & Pengumuman
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS berita (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        judul TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        kategori TEXT NOT NULL,
        ringkasan TEXT NOT NULL,
        konten TEXT NOT NULL,
        penulis TEXT NOT NULL,
        tanggal TEXT NOT NULL,
        gambar TEXT,
        is_featured INTEGER DEFAULT 0
    );
    """)

    # Table: Guru & Staf
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS guru (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        jabatan TEXT NOT NULL,
        bidang_studi TEXT NOT NULL,
        pendidikan TEXT NOT NULL,
        foto TEXT,
        urutan INTEGER DEFAULT 0
    );
    """)

    # Table: Ekstrakurikuler
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ekskul (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        kategori TEXT NOT NULL,
        deskripsi TEXT NOT NULL,
        pembina TEXT NOT NULL,
        jadwal TEXT NOT NULL,
        prestasi TEXT,
        icon TEXT,
        badge TEXT
    );
    """)

    # Table: Testimoni
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS testimoni (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        status TEXT NOT NULL,
        angkatan_relasi TEXT,
        pesan TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        avatar_initials TEXT
    );
    """)

    # Table: Pesan & Konsultasi Masuk
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pesan_kontak (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT,
        no_whatsapp TEXT NOT NULL,
        kategori TEXT NOT NULL,
        subjek TEXT NOT NULL,
        pesan TEXT NOT NULL,
        status TEXT DEFAULT 'Belum Dibaca',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Table: Cek Nilai Siswa / Raport Demo
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS siswa_raport (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nisn TEXT UNIQUE NOT NULL,
        nama_siswa TEXT NOT NULL,
        kelas TEXT NOT NULL,
        semester TEXT NOT NULL,
        tahun_ajaran TEXT NOT NULL,
        status_kelulusan TEXT NOT NULL,
        nilai_pabp INTEGER,
        nilai_ppkn INTEGER,
        nilai_bindo INTEGER,
        nilai_binggris INTEGER,
        nilai_matematika INTEGER,
        nilai_ipa INTEGER,
        nilai_ips INTEGER,
        nilai_tahfidz TEXT,
        akhlak TEXT
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database schema successfully initialized.")
