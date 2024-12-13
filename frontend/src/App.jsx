import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Search from "./pages/Search/Search";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import History from "./pages/History/History";
import Address from "./pages/address/address";


const App = () => {

 const [showLogin,setShowLogin] = useState(false)

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin}/>
        <div className="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/Cart' element={<Cart />} />
            <Route path='/Order' element={<PlaceOrder />} />
            <Route path='/Verify' element={<Verify />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/history' element={<History />} />
            <Route path='/address' element={<Address />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
