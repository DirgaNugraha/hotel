from sqlalchemy import Column, Integer, String, Float, Text, Date, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(255), nullable=False)
    no_telepon = Column(String(20), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum("admin", "tamu"), default="tamu")
    created_at = Column(DateTime, default=datetime.utcnow)

class Kamar(Base):
    __tablename__ = "kamar"

    id = Column(Integer, primary_key=True, index=True)
    nomor_kamar = Column(String(20), nullable=False)
    tipe_kamar = Column(String(50))
    gambar_kamar = Column(String(255))
    deskripsi = Column(Text)
    harga = Column(Float)
    status = Column(Enum("tersedia", "terisi"), default="tersedia")

class Fasilitas(Base):
    __tablename__ = "fasilitas"

    id = Column(Integer, primary_key=True, index=True)
    nama_fasilitas = Column(String(255))
    deskripsi = Column(Text)
    gambar_fasilitas = Column(String(255))

class Reservasi(Base):
    __tablename__ = "reservasi"

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("users.id"))
    id_kamar = Column(Integer, ForeignKey("kamar.id"))
    nomor_kamar = Column(String(20))
    tanggal_checkin = Column(Date)
    tanggal_checkout = Column(Date)
    status = Column(Enum("pending", "selesai"), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
