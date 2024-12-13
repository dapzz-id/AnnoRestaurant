import React, { useState, useEffect } from "react";
import "./Edit.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Edit = ({url}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { foodId, name, description, price, category, image } = location.state;
      setSelectedItem({ _id: foodId, image });
      setData({ name, description, price, category });
    }
  }, [location]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!selectedItem) {
      toast.error("Pilih item untuk diedit terlebih dahulu");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmEdit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(`${url}/api/food/edit/${selectedItem._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token')
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        
        // Perbarui data di List.jsx
        const updatedItem = response.data.data;
        navigate('/list', { state: { updatedItem } });
      } else {
        toast.error(response.data.message || "Terjadi kesalahan saat mengedit item");
      }
    } catch (error) {
      console.error("Error mengedit item:", error);
      toast.error(error.response?.data?.message || "Gagal mengedit item. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="edit">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="edit-img-upload flex-col">
          <p>Unggah Gambar</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : (selectedItem ? `${url}/images/${selectedItem.image}` : assets.upload_area)}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </div>
        <div className="edit-product-name flex-col">
          <p>Nama Produk</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Ketik di sini"
            required
          />
        </div>
        <div className="edit-product-description flex-col">
          <p>Deskripsi Produk</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Tulis konten di sini"
            required
          ></textarea>
        </div>
        <div className="edit-category-price">
          <div className="edit-category flex-col">
            <p>Kategori Produk</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>
          <div className="edit-price flex-col">
            <p>Harga Produk</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="20000"
              required
            />
          </div>
        </div>
        <button type="submit" className="edit-btn" disabled={isSubmitting}>
          {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
        </button>
      </form>
      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-buttons">
            <p>Apakah Anda yakin ingin menyimpan perubahan ini?</p>
            <button onClick={confirmEdit}>Ya</button>
            <button onClick={() => setShowConfirmation(false)}>Tidak</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
