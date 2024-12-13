import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({url}) => {

  const [list,setList] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [totalMakanan, setTotalMakanan] = useState(0);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        setTotalMakanan(response.data.data.length);
      } else {
        toast.error("Gagal mengambil data")
      }
    } catch (error) {
      console.error("Error mengambil data:", error);
      toast.error("Terjadi kesalahan saat mengambil data")
    }
  }

  const confirmRemoveFood = (foodId) => {
    setSelectedFoodId(foodId);
    setShowConfirmDialog(true);
  }

  const removeFood = async() => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: selectedFoodId }, {
        headers: {
          'token': localStorage.getItem('token')
        }
      });
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message || "Gagal menghapus item")
      }
    } catch (error) {
      console.error("Error menghapus item:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat menghapus item")
    } finally {
      setShowConfirmDialog(false);
    }
  }

  const editFood = (item) => {
    navigate('/edit', { 
      state: { 
        foodId: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image
      } 
    });
  }

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Gambar</b>
          <b>Nama</b>
          <b>Kategori</b>
          <b>Harga</b>
          <b>Aksi</b>
        </div>
        {list.map((item,index)=>{
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}.000</p>
              <div className="action-buttons">
                <button 
                  onClick={()=>editFood(item)} 
                  className='cursor edit-btn'
                  title="Edit makanan ini"
                >
                  Edit
                </button>
                <button 
                  onClick={()=>confirmRemoveFood(item._id)} 
                  className='cursor remove-btn'
                  title="Hapus makanan ini"
                >
                  Hapus
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {showConfirmDialog && (
          <div className="confirmation-popup">
              <div className="confirmation-buttons">
              <p>Apakah Anda yakin ingin menghapus makanan ini?</p>
            <button onClick={removeFood}>Ya</button>
            <button onClick={() => setShowConfirmDialog(false)}>Tidak</button>
              </div>
            </div>
      )}
    </div>
  )
}

export default List
