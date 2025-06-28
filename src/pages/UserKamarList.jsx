import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

export default function UserKamarList() {
  const [kamarList, setKamarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKamarId, setSelectedKamarId] = useState(null);
  const [checkinDates, setCheckinDates] = useState({});
  const [checkoutDates, setCheckoutDates] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchKamar();
  }, []);

  const fetchKamar = async () => {
    try {
      const res = await axios.get("http://localhost:8000/kamar");
      setKamarList(res.data);
    } catch (error) {
      console.error("Gagal fetch kamar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservasi = async (id_kamar) => {
    const checkin = checkinDates[id_kamar];
    const checkout = checkoutDates[id_kamar];

    if (!checkin || !checkout) {
      alert("Pilih tanggal check-in dan check-out terlebih dahulu");
      return;
    }

    if (checkin >= checkout) {
      alert("Tanggal check-out harus setelah check-in");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/user/reservasi",
        {
          id_kamar,
          tanggal_checkin: checkin.toISOString().split("T")[0],
          tanggal_checkout: checkout.toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Reservasi berhasil!");
      fetchKamar();
      setSelectedKamarId(null); // reset UI
    } catch (error) {
      alert("Reservasi gagal: " + error.response?.data?.detail);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Memuat daftar kamar...</h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h1 className="display-5 fw-bold text-dark mb-2">Daftar Kamar Tersedia</h1>
                <p className="lead text-muted mb-0">Pilih kamar yang sesuai dengan kebutuhan Anda</p>
              </div>
              <Link to="/user/dashboard" className="btn btn-outline-primary btn-lg">
                <i className="fas fa-arrow-left me-2"></i>
                Kembali ke Dashboard
              </Link>
            </div>
            <div
              className="mx-0 mt-3"
              style={{
                width: "100px",
                height: "4px",
                backgroundColor: "#007bff",
                borderRadius: "2px",
              }}
            ></div>
          </div>
        </div>

        <div className="row g-4">
          {kamarList.map((kamar) => (
            <div className="col-lg-4 col-md-6" key={kamar.id}>
              <div className="card h-100 shadow-lg border-0 overflow-hidden position-relative">
                {/* Status Badge */}
                <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 2 }}>
                  <span className={`badge ${kamar.status === "tersedia" ? "bg-success" : "bg-danger"} px-3 py-2 rounded-pill`}>
                    {kamar.status === "tersedia" ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </div>

                {/* Room Image */}
                <div className="position-relative">
                  {kamar.gambar_kamar ? (
                    <img
                      src={`/images/${kamar.gambar_kamar}`}
                      className="card-img-top"
                      alt="Gambar kamar"
                      style={{ objectFit: "cover", height: "250px" }}
                    />
                  ) : (
                    <div 
                      className="bg-gradient d-flex align-items-center justify-content-center text-white"
                      style={{ height: "250px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                    >
                      <i className="fas fa-bed fa-3x opacity-75"></i>
                    </div>
                  )}
                  <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <h4 className="text-white fw-bold mb-0">Kamar #{kamar.nomor_kamar}</h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                  <div className="mb-3">
                    <p className="text-muted mb-2 lh-base">{kamar.deskripsi}</p>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-tag text-primary me-2"></i>
                        <small className="text-muted">Tipe</small>
                      </div>
                      <p className="fw-semibold mb-0">{kamar.tipe_kamar}</p>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-money-bill-wave text-success me-2"></i>
                        <small className="text-muted">Harga</small>
                      </div>
                      <p className="fw-bold text-success mb-0">Rp {parseInt(kamar.harga).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  {selectedKamarId === kamar.id && (
                    <div className="bg-light p-3 rounded-3 mb-3">
                      <h6 className="fw-bold mb-3 text-center">Pilih Tanggal Menginap</h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-muted small fw-semibold">Check-in</label>
                          <DatePicker
                            selected={checkinDates[kamar.id] || null}
                            onChange={(date) =>
                              setCheckinDates({ ...checkinDates, [kamar.id]: date })
                            }
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            className="form-control form-control-sm"
                            placeholderText="Pilih tanggal"
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted small fw-semibold">Check-out</label>
                          <DatePicker
                            selected={checkoutDates[kamar.id] || null}
                            onChange={(date) =>
                              setCheckoutDates({ ...checkoutDates, [kamar.id]: date })
                            }
                            dateFormat="yyyy-MM-dd"
                            minDate={checkinDates[kamar.id] || new Date()}
                            className="form-control form-control-sm"
                            placeholderText="Pilih tanggal"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-white border-0 p-4 pt-0">
                  {selectedKamarId === kamar.id ? (
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-success btn-lg fw-semibold"
                        onClick={() => handleReservasi(kamar.id)}
                        disabled={kamar.status !== "tersedia"}
                      >
                        <i className="fas fa-check-circle me-2"></i>
                        Konfirmasi Reservasi
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSelectedKamarId(null)}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="d-grid">
                      <button
                        className={`btn btn-lg fw-semibold ${
                          kamar.status === "tersedia" 
                            ? "btn-primary" 
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setSelectedKamarId(kamar.id)}
                        disabled={kamar.status !== "tersedia"}
                      >
                        {kamar.status === "tersedia" ? (
                          <>
                            <i className="fas fa-calendar-plus me-2"></i>
                            Reservasi Sekarang
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times-circle me-2"></i>
                            Tidak Tersedia
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {kamarList.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-bed fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">Tidak ada kamar tersedia</h4>
            <p className="text-muted">Silakan coba lagi nanti</p>
          </div>
        )}
      </div>
    </div>
  );
}