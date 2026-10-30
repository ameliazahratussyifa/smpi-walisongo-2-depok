"""
Pydantic schemas and data validation models for SMP Islam Walisongo 2 Depok.
"""
from pydantic import BaseModel, Field
from typing import Optional

class PPDBRegistrationCreate(BaseModel):
    nama_lengkap: str = Field(..., min_length=3, max_length=150)
    nisn: str = Field(..., min_length=10, max_length=10)
    nik: Optional[str] = Field(None, max_length=16)
    jenis_kelamin: str
    tempat_lahir: Optional[str] = None
    tanggal_lahir: Optional[str] = None
    asal_sekolah: str = Field(..., min_length=3)
    nama_wali: str = Field(..., min_length=3)
    no_wa_wali: str = Field(..., min_length=9, max_length=20)
    alamat_lengkap: Optional[str] = None
    jalur_pendaftaran: str
    pilihan_peminatan: Optional[str] = "Reguler & Tahfidz"

class PesanKontakCreate(BaseModel):
    nama: str = Field(..., min_length=3)
    email: Optional[str] = None
    no_whatsapp: str = Field(..., min_length=9)
    kategori: str = "Pertanyaan Umum"
    subjek: str = Field(..., min_length=3)
    pesan: str = Field(..., min_length=5)

class RaportCheckRequest(BaseModel):
    nisn: str

class AIQueryRequest(BaseModel):
    pertanyaan: str
