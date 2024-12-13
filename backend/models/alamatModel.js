import mongoose from "mongoose";

const alamatSchema = new mongoose.Schema({
  namaDepan: {
    type: String,
    required: true
  },
  namaBelakang: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  namaJalan: {
    type: String,
    required: true
  },
  kota: {
    type: String,
    required: true
  },
  provinsi: {
    type: String,
    required: true
  },
  kodePos: {
    type: String,
    required: true
  },
  negara: {
    type: String,
    required: true
  },
  nomorTelepon: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Alamat = mongoose.model("Alamat", alamatSchema);

export default Alamat;
