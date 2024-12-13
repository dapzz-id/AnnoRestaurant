import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (showPopup || showLoginPopup || showDeletePopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup, showLoginPopup, showDeletePopup]);

  const handleButtonClick = () => {
    if (getTotalCartAmount() === 0) {
      setShowPopup(true);
    } else if (token) {
      navigate('/order');
    } else {
      setShowLoginPopup(true);
    }
  };

  const handlePromoCode = () => {
    // Logika sederhana untuk kode promo
    if (promoCode === "DISKON10" && !promoApplied) {
      setDiscount(10); // Diskon 10.000
      setPromoApplied(true);
      alert("Kode promo berhasil diterapkan! Anda mendapatkan diskon 10.000");
    } else if (promoCode === "DISKON20" && !promoApplied) {
      setDiscount(20); // Diskon 20.000
      setPromoApplied(true);
      alert("Kode promo berhasil diterapkan! Anda mendapatkan diskon 20.000");
    } else if (promoCode === "DISKON30" && !promoApplied) {
      setDiscount(30); // Diskon 30.000
      setPromoApplied(true);
      alert("Kode promo berhasil diterapkan! Anda mendapatkan diskon 30.000");
    } else if (promoApplied) {
      alert("Anda sudah menggunakan kode promo");
    } else {
      setDiscount(0);
      alert("Kode promo tidak valid");
    }
    setPromoCode(""); // Reset input kode promo
  };

  const totalAfterDiscount = Math.max(0, getTotalCartAmount() - discount);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete);
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="cart">
      {showPopup && (
        <div className="login-popup">
          <div className="login-popup-content">
            <h2 style={{marginBottom: '10px'}}>Keranjang Kosong</h2>
            <p>Harap membeli setidaknya satu makanan yang tersedia.</p>
            <button onClick={() => setShowPopup(false)}>Tutup</button>
          </div>
        </div>
      )}
      {showLoginPopup && (
        <div className="login-popup">
          <div className="login-popup-content">
            <h2 style={{marginBottom: '10px'}}>Harap Login</h2>
            <p>Silakan login terlebih dahulu untuk melanjutkan pemesanan.</p>
            <button onClick={() => setShowLoginPopup(false)}>Tutup</button>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="login-popup">
          <div className="login-popup-content">
            <h2 style={{marginBottom: '10px'}}>Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus item ini dari keranjang?</p>
            <div>
              <button onClick={confirmDelete} style={{backgroundColor: 'green'}}>Ya</button>
              <button onClick={() => setShowDeletePopup(false)}>Tidak</button>
            </div>
          </div>
        </div>
      )}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Barang</p>
          <p>Judul</p>
          <p>Harga</p>
          <p>Jumlah</p>
          <p>Total</p>
          <p>Hapus</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{formatPrice(item.price)}.000</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{formatPrice(item.price * cartItems[item._id])}.000</p>
                  <p onClick={() => handleDeleteClick(item._id)} className="cross">
                    <FaTrash className="trash-icon" />
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total Keranjang</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatPrice(getTotalCartAmount())}.000</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Diskon</p>
                  <p>-{formatPrice(discount)}.000</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>{formatPrice(totalAfterDiscount)}.000</b>
            </div>
          </div>
            <button onClick={handleButtonClick}>LANJUTKAN PENGISIAN ALAMAT</button>
        </div>
        {/* <div className="cart-promocode">
          <p>Apakah punya kode promonya? Masukkan di sini!</p>
          <div className='cart-promocode-input'>
            <input 
              type="text" 
              placeholder="Kode promo" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={handlePromoCode}>Kirim</button>
          </div>
          {promoApplied && <p>Kode promo telah diterapkan</p>}
        </div> */}
      </div>
    </div>
  );
};

export default Cart;
