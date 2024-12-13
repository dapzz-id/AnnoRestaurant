import mongoose from "mongoose";

const curirSchema = new mongoose.Schema({
    courirId: { 
        type: String, 
        required: true, 
        unique: true, 
        default: function() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return 'CR-' + result;
        }
    },
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    noTelepon: { type: String, required: true },
    statusAktif: { type: Boolean, default: true },
    pesananDiproses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pesanan' }],
    riwayatPengiriman: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pesanan' }],
    rating: { type: Number, default: 0 },
    jumlahPenilaian: { type: Number, default: 0 }
}, { timestamps: true });

const curirModel = mongoose.models.curir || mongoose.model("curir", curirSchema);

export default curirModel;
