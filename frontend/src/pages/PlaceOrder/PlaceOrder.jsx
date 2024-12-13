import React, { useContext, useState, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"Jakarta",
    state:"DKI Jakarta",
    district:"",
    country:"Indonesia",
    phone:""
  })

  const jabodetabekAreas = {
    "DKI Jakarta": {
      "Jakarta": ["Gambir", "Tanah Abang", "Menteng", "Senen", "Cempaka Putih"],
      "Jakarta Utara": ["Penjaringan", "Tanjung Priok", "Koja", "Cilincing", "Pademangan"],
      "Jakarta Barat": ["Grogol Petamburan", "Taman Sari", "Tambora", "Kebon Jeruk", "Kalideres"],
      "Jakarta Selatan": ["Kebayoran Baru", "Kebayoran Lama", "Pesanggrahan", "Cilandak", "Pasar Minggu"],
      "Jakarta Timur": ["Matraman", "Pulo Gadung", "Jatinegara", "Duren Sawit", "Kramat Jati"]
    },
    "Jawa Barat": {
      "Bogor": ["Bogor Utara", "Bogor Selatan", "Bogor Timur", "Bogor Tengah", "Bogor Barat"],
      "Depok": ["Beji", "Pancoran Mas", "Cipayung", "Sukmajaya", "Cilodong"],
      "Bekasi": ["Bekasi Utara", "Bekasi Selatan", "Bekasi Timur", "Bekasi Barat", "Rawalumbu"]
    },
    "Banten": {
      "Tangerang": ["Ciledug", "Karawaci", "Periuk", "Jatiuwung", "Cibodas"],
      "Tangerang Selatan": ["Serpong", "Ciputat", "Pamulang", "Pondok Aren", "Setu"]
    }
  }

  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    setCities(Object.keys(jabodetabekAreas[data.state] || {}))
    setData(data => ({...data, city: Object.keys(jabodetabekAreas[data.state] || {})[0] || ""}))
  }, [data.state])

  useEffect(() => {
    setDistricts(jabodetabekAreas[data.state]?.[data.city] || [])
    setData(data => ({...data, district: (jabodetabekAreas[data.state]?.[data.city] || [])[0] || ""}))
  }, [data.state, data.city])

  const calculateDeliveryFee = () => {
    const restaurantLocation = {
      state: "Jawa Barat",
      city: "Bekasi",
      district: "Bekasi Selatan"
    };

    let fee = 0;

    if (data.state === restaurantLocation.state) {
      if (data.city === restaurantLocation.city) {
        if (data.district === restaurantLocation.district) {
          fee = 5000; // Dalam satu kecamatan
        } else {
          fee = 10000; // Dalam satu kota
        }
      } else {
        fee = 20000; // Dalam satu provinsi
      }
    } else {
      fee = 30000; // Luar provinsi
    }

    setDeliveryFee(fee);
  };

  useEffect(() => {
    calculateDeliveryFee();
  }, [data.state, data.city, data.district]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data,[name]:value}))
  }

  const placeOrder = async(event)=>{
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if (cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+deliveryFee/1000,
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if (response.data.success) {
      const {session_url} = response.data;
      window.location.replace(session_url);
    }
    else{
      alert("Error")
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{
    if (!token) {
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0)
    {
     navigate('/cart') 
    }
  },[token])

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Informasi Pengiriman</p>
        <p className="shipping-note">Catatan: Kami hanya melayani pengiriman di wilayah Jabodetabek.</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Nama Depan'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Nama Belakang'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Alamat Email'/>
        <div className="multi-fields">
          <select 
            required 
            name='state' 
            onChange={onChangeHandler} 
            value={data.state}
          >
            {Object.keys(jabodetabekAreas).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <select 
            required 
            name='city' 
            onChange={onChangeHandler} 
            value={data.city}
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <select 
          required 
          name='district' 
          onChange={onChangeHandler} 
          value={data.district}
        >
          {districts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Jalan'/>
        
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Kode Pos'/>
          <input required name='country' value={data.country} type="text" placeholder='Negara' readOnly/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Nomor Telepon'/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Total Keranjang</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatPrice(getTotalCartAmount())}.000</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Biaya Pengiriman</p>
              <p>{formatPrice(deliveryFee/1000)}.000</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{formatPrice(getTotalCartAmount()+deliveryFee/1000)}.000</b>
            </div>
          </div>
          <button type='submit'>LANJUTKAN KE PEMBAYARAN</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
