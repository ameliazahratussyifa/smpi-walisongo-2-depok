"""
Authentication and session management for SMP Islam Walisongo 2 Depok.
Provides password hashing (SHA-256 + salt) and HMAC-signed session tokens.
Uses Python standard library for maximum reliability on serverless (Vercel) & local environments.
"""
import os
import time
import json
import hmac
import base64
import hashlib
from typing import Optional, Dict, Any
from fastapi import Request

# Application Secret Key for signing session cookies
SECRET_KEY = os.environ.get("SESSION_SECRET", "walisongo-2-depok-secret-key-2026-bismillah-barakah").encode("utf-8")
COOKIE_NAME = "walisongo_session"
SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60  # 7 days

def hash_password(password: str, salt: str = "ws2depok") -> str:
    """Hashes a password with salt using SHA-256."""
    salted = f"{salt}:{password}:{salt}".encode("utf-8")
    return hashlib.sha256(salted).hexdigest()

def verify_password(plain_password: str, hashed_password: str, salt: str = "ws2depok") -> bool:
    """Verifies plain password against hashed password."""
    return hmac.compare_digest(hash_password(plain_password, salt), hashed_password)

def create_session_token(user_id: int, username: str, role: str, nama_lengkap: str) -> str:
    """Creates a base64url-encoded HMAC-signed session token with expiration timestamp."""
    payload = {
        "uid": user_id,
        "usr": username,
        "rol": role,
        "nam": nama_lengkap,
        "exp": int(time.time()) + SESSION_DURATION_SECONDS
    }
    raw_json = json.dumps(payload, separators=(',', ':')).encode("utf-8")
    b64_payload = base64.urlsafe_b64encode(raw_json).decode("utf-8").rstrip("=")
    
    # Calculate HMAC signature
    signature = hmac.new(SECRET_KEY, b64_payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{b64_payload}.{signature}"

def verify_session_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies HMAC signature and expiration of session token. Returns payload dict or None."""
    if not token or "." not in token:
        return None
    try:
        b64_payload, signature = token.split(".", 1)
        expected_sig = hmac.new(SECRET_KEY, b64_payload.encode("utf-8"), hashlib.sha256).hexdigest()
        
        if not hmac.compare_digest(signature, expected_sig):
            return None
            
        # Add padding back if necessary
        padding = "=" * (4 - (len(b64_payload) % 4)) if (len(b64_payload) % 4) != 0 else ""
        raw_json = base64.urlsafe_b64decode((b64_payload + padding).encode("utf-8"))
        payload = json.loads(raw_json.decode("utf-8"))
        
        # Check expiration
        if payload.get("exp", 0) < int(time.time()):
            return None
            
        return {
            "id": payload.get("uid"),
            "username": payload.get("usr"),
            "role": payload.get("rol"),
            "nama_lengkap": payload.get("nam")
        }
    except Exception:
        return None

def get_current_user(request: Request) -> Optional[Dict[str, Any]]:
    """Extracts and verifies logged-in user from request cookies or Authorization header."""
    # 1. Check HttpOnly cookie
    token = request.cookies.get(COOKIE_NAME)
    
    # 2. Check Authorization Bearer header
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            
    if not token:
        return None
        
    return verify_session_token(token)

def record_system_log(action: str, detail: str, username: str = "system", user_id: Optional[int] = None, ip_address: str = "127.0.0.1") -> None:
    """Records audit trail log into Supabase and local SQLite."""
    try:
        from backend.supabase_client import is_supabase_enabled, supabase_insert_log
        if is_supabase_enabled():
            supabase_insert_log({
                "action": action,
                "detail": detail,
                "username": username,
                "user_id": user_id,
                "ip_address": ip_address
            })
    except Exception as e:
        print(f"[Supabase Log Warning] {e}")

    try:
        from backend.database import get_db_connection
        conn = get_db_connection()
        conn.execute("""
        INSERT INTO system_logs (user_id, username, action, detail, ip_address)
        VALUES (?, ?, ?, ?, ?)
        """, (user_id, username, action, detail, ip_address))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Local Log Warning] {e}")

