"""
Supabase Cloud Database Client for SMP Islam Walisongo 2 Depok.
Supports seamless cloud persistence with graceful SQLite fallback.
"""
import os
from typing import Optional, Dict, Any, List

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", os.environ.get("SUPABASE_ANON_KEY", "")).strip()

_supabase_client = None

def get_supabase():
    global _supabase_client
    if not is_supabase_enabled():
        return None
    if _supabase_client is None:
        try:
            from supabase import create_client
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        except Exception as e:
            print(f"[Supabase Init Warning] {e}")
            return None
    return _supabase_client

def is_supabase_enabled() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY)

# ==================== DATA METHODS ====================

def supabase_insert_ppdb(data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    sb = get_supabase()
    if not sb:
        return None
    try:
        res = sb.table("ppdb_pendaftar").insert(data).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
    except Exception as e:
        print(f"[Supabase PPDB Insert Error] {e}")
    return None

def supabase_get_ppdb(query: str) -> Optional[Dict[str, Any]]:
    sb = get_supabase()
    if not sb:
        return None
    try:
        q = query.strip()
        # Search by nomor_registrasi or nisn
        res = sb.table("ppdb_pendaftar").select("*").or_(f"nomor_registrasi.ilike.{q},nisn.eq.{q}").limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
    except Exception as e:
        print(f"[Supabase PPDB Query Error] {e}")
    return None

def supabase_get_all_ppdb() -> Optional[List[Dict[str, Any]]]:
    sb = get_supabase()
    if not sb:
        return None
    try:
        res = sb.table("ppdb_pendaftar").select("*").order("id", desc=True).execute()
        return res.data
    except Exception as e:
        print(f"[Supabase PPDB All Error] {e}")
    return None

def supabase_update_ppdb_status(record_id: int, status: str, catatan: str) -> bool:
    sb = get_supabase()
    if not sb:
        return False
    try:
        sb.table("ppdb_pendaftar").update({"status_seleksi": status, "catatan": catatan}).eq("id", record_id).execute()
        return True
    except Exception as e:
        print(f"[Supabase PPDB Update Error] {e}")
        return False

def supabase_insert_pesan(data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    sb = get_supabase()
    if not sb:
        return None
    try:
        res = sb.table("pesan_kontak").insert(data).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
    except Exception as e:
        print(f"[Supabase Pesan Insert Error] {e}")
    return None

def supabase_get_all_pesan() -> Optional[List[Dict[str, Any]]]:
    sb = get_supabase()
    if not sb:
        return None
    try:
        res = sb.table("pesan_kontak").select("*").order("id", desc=True).limit(20).execute()
        return res.data
    except Exception as e:
        print(f"[Supabase Pesan All Error] {e}")
    return None

def supabase_get_raport(nisn: str) -> Optional[Dict[str, Any]]:
    sb = get_supabase()
    if not sb:
        return None
    try:
        res = sb.table("siswa_raport").select("*").eq("nisn", nisn.strip()).limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
    except Exception as e:
        print(f"[Supabase Raport Error] {e}")
    return None
