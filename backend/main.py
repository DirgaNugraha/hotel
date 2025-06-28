from fastapi import FastAPI, HTTPException, Depends, Body, Header, Path
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

from database import SessionLocal, engine
import models

from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Jika frontend beda domain, aktifkan CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "ganti_secret_key_anda"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token tidak ditemukan")
    scheme, _, param = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Skema token invalid")
    try:
        payload = jwt.decode(param, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return user

def get_current_role(role: str):
    def role_dependency(current_user: models.User = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(status_code=403, detail=f"Only {role} can access this endpoint")
        return current_user
    return role_dependency

get_current_tamu = get_current_role("tamu")
get_current_admin = get_current_role("admin")


# Register
@app.post("/users")
def register_user(payload: dict = Body(...), db: Session = Depends(get_db)):
    nama = payload.get("nama")
    no_telepon = payload.get("no_telepon")
    email = payload.get("email")
    password = payload.get("password")

    if not all([nama, no_telepon, email, password]):
        raise HTTPException(status_code=400, detail="Semua field wajib diisi.")
    if not no_telepon.isdigit() or len(no_telepon) < 8:
        raise HTTPException(status_code=400, detail="Nomor telepon harus angka minimal 8 digit.")
    if not email.endswith("@gmail.com"):
        raise HTTPException(status_code=400, detail="Email harus menggunakan domain @gmail.com.")
    if len(password) < 4:
        raise HTTPException(status_code=400, detail="Password minimal 4 karakter.")

    hashed = get_password_hash(password)
    user = models.User(
        nama=nama,
        no_telepon=no_telepon,
        email=email,
        password=hashed,
        role="tamu",
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registrasi berhasil"}

# Login
@app.post("/login")
def login(payload: dict = Body(...), db: Session = Depends(get_db)):
    username = payload.get("username")
    password = payload.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Email dan password wajib diisi.")

    user = db.query(models.User).filter(models.User.email == username).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Email atau password salah.")

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }

# PUBLIC - List Fasilitas
@app.get("/fasilitas")
def list_fasilitas(db: Session = Depends(get_db)):
    return db.query(models.Fasilitas).all()

# PUBLIC - List kamar
@app.get("/kamar")
def list_kamar(db: Session = Depends(get_db)):
    return db.query(models.Kamar).all()

# USER - Reservasi
@app.post("/user/reservasi")
def create_reservasi(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_tamu)
):
    id_kamar = payload.get("id_kamar")
    tgl_in = payload.get("tanggal_checkin")
    tgl_out = payload.get("tanggal_checkout")

    kamar = db.query(models.Kamar).filter(models.Kamar.id == id_kamar).first()
    if not kamar:
        raise HTTPException(status_code=404, detail="Kamar tidak ditemukan")
    if kamar.status != "tersedia":
        raise HTTPException(status_code=400, detail="Kamar tidak tersedia")

    checkin = datetime.strptime(tgl_in, "%Y-%m-%d").date()
    checkout = datetime.strptime(tgl_out, "%Y-%m-%d").date()
    today = datetime.now().date()

    if checkin < today or checkout <= checkin:
        raise HTTPException(status_code=400, detail="Tanggal tidak valid")

    reservasi = models.Reservasi(
        id_user=user.id,
        id_kamar=kamar.id,
        nomor_kamar=kamar.nomor_kamar,
        tanggal_checkin=checkin,
        tanggal_checkout=checkout,
        status="pending",
        created_at=datetime.now().date()
    )
    kamar.status = "terisi"
    db.add(reservasi)
    db.commit()
    return {"message": "Reservasi berhasil"}

@app.get("/user/reservasi")
def list_reservasi_user(db: Session = Depends(get_db), user: models.User = Depends(get_current_tamu)):
    return db.query(models.Reservasi).filter(models.Reservasi.id_user == user.id).all()

@app.put("/user/reservasi/{id}")
def update_reservasi_user(
    id: int = Path(...),
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_tamu)
):
    reservasi = db.query(models.Reservasi).filter(
        models.Reservasi.id == id,
        models.Reservasi.id_user == user.id
    ).first()

    if not reservasi:
        raise HTTPException(status_code=404, detail="Reservasi tidak ditemukan")

    tgl_in = payload.get("tanggal_checkin")
    tgl_out = payload.get("tanggal_checkout")

    if not tgl_in or not tgl_out:
        raise HTTPException(status_code=400, detail="Tanggal check-in dan check-out wajib diisi.")

    try:
        checkin = datetime.strptime(tgl_in, "%Y-%m-%d").date()
        checkout = datetime.strptime(tgl_out, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format tanggal tidak valid. Gunakan YYYY-MM-DD.")

    today = datetime.now().date()

    if checkin < today:
        raise HTTPException(status_code=400, detail="Tanggal check-in tidak boleh di masa lalu.")
    if checkout <= checkin:
        raise HTTPException(status_code=400, detail="Tanggal check-out harus lebih dari check-in.")

    reservasi.tanggal_checkin = checkin
    reservasi.tanggal_checkout = checkout
    db.commit()

    return {"message": "Tanggal reservasi diperbarui"}

@app.delete("/user/reservasi/{id}")
def batal_reservasi(id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_tamu)):
    reservasi = db.query(models.Reservasi).filter(models.Reservasi.id == id, models.Reservasi.id_user == user.id).first()
    if reservasi:
        kamar = db.query(models.Kamar).get(reservasi.id_kamar)
        if kamar:
            kamar.status = "tersedia"
        db.delete(reservasi)
        db.commit()
    return {"message": "Reservasi dibatalkan"}

# ADMIN - CRUD USER
@app.get("/admin/users")
def admin_list_users(db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    return db.query(models.User).all()

@app.post("/admin/users")
def admin_create_user(payload: dict = Body(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    nama = payload.get("nama")
    no_telepon = payload.get("no_telepon")
    email = payload.get("email")
    password = payload.get("password")
    role = payload.get("role", "tamu")

    if not all([nama, no_telepon, email, password]):
        raise HTTPException(status_code=400, detail="Semua field wajib diisi.")
    
    hashed = get_password_hash(password)
    user_obj = models.User(
        nama=nama,
        no_telepon=no_telepon,
        email=email,
        password=hashed,
        role=role,
        created_at=datetime.utcnow()
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

@app.put("/admin/users/{id}")
def admin_update_user(id: int, payload: dict = Body(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    target = db.query(models.User).get(id)
    if not target:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    for k, v in payload.items():
        if k == "password":
            setattr(target, k, get_password_hash(v))
        else:
            setattr(target, k, v)
    db.commit()
    return {"message": "User diperbarui"}

@app.delete("/admin/users/{id}")
def admin_delete_user(id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    target = db.query(models.User).get(id)
    if target:
        db.delete(target)
        db.commit()
    return {"message": "User dihapus"}

# ADMIN - CRUD KAMAR
@app.get("/admin/kamar")
def admin_list_kamar(db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    return db.query(models.Kamar).all()

@app.post("/admin/kamar")
def admin_create_kamar(payload: dict = Body(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    kamar = models.Kamar(**payload)
    db.add(kamar)
    db.commit()
    db.refresh(kamar)
    return kamar

@app.put("/admin/kamar/{id}")
def admin_update_kamar(id: int, payload: dict = Body(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    kamar = db.query(models.Kamar).get(id)
    if not kamar:
        raise HTTPException(status_code=404, detail="Kamar tidak ditemukan")
    for k, v in payload.items():
        setattr(kamar, k, v)
    db.commit()
    return kamar

@app.delete("/admin/kamar/{id}")
def admin_delete_kamar(id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    kamar = db.query(models.Kamar).get(id)
    if kamar:
        db.delete(kamar)
        db.commit()
    return {"message": "Kamar dihapus"}

# ADMIN - CRUD FASILITAS
@app.get("/admin/fasilitas")
def admin_list_fasilitas(db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    return db.query(models.Fasilitas).all()

@app.post("/admin/fasilitas")
def admin_create_fasilitas(payload: dict = Body(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    fasilitas = models.Fasilitas(**payload)
    db.add(fasilitas)
    db.commit()
    db.refresh(fasilitas)
    return fasilitas

@app.put("/admin/fasilitas/{id}")
def admin_update_fasilitas(
    id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_admin)
):
    fasilitas = db.query(models.Fasilitas).get(id)
    if not fasilitas:
        raise HTTPException(status_code=404, detail="Fasilitas tidak ditemukan")
    for k, v in payload.items():
        setattr(fasilitas, k, v)
    db.commit()
    return {"message": "Fasilitas diperbarui"}

@app.delete("/admin/fasilitas/{id}")
def admin_delete_fasilitas(
    id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_admin)
):
    fasilitas = db.query(models.Fasilitas).get(id)
    if not fasilitas:
        raise HTTPException(status_code=404, detail="Fasilitas tidak ditemukan")
    db.delete(fasilitas)
    db.commit()
    return {"message": "Fasilitas dihapus"}

# ADMIN - CRUD RESERVASI
@app.get("/admin/reservasi")
def admin_list_reservasi(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_admin)
):
    return db.query(models.Reservasi).all()

@app.put("/admin/reservasi/{id}")
def admin_update_reservasi(id: int, payload: dict = Body(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    reservasi = db.query(models.Reservasi).get(id)
    if not reservasi:
        raise HTTPException(status_code=404, detail="Reservasi tidak ditemukan")
    
    for k, v in payload.items():
        setattr(reservasi, k, v)
    db.commit()
    return {"message": "Reservasi diperbarui"}

@app.delete("/admin/reservasi/{id}")
def admin_delete_reservasi(id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_admin)):
    reservasi = db.query(models.Reservasi).get(id)
    if reservasi:
        db.delete(reservasi)
        db.commit()
    return {"message": "Reservasi dihapus"}
