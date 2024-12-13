import React, { useContext, useState, useEffect, useRef } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({setShowLogin}) => {
  const {url,setToken} = useContext(StoreContext);
  const [isClosing, setIsClosing] = useState(false);
  const popupRef = useRef(null);
  const containerRef = useRef(null);

  const [currstate,setCurrState] = useState("Login")
  const [data,setData] = useState({
      name:"",
      email:"",
      password:""
  })
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockTime = localStorage.getItem('lockTime');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    if (storedLockTime) {
      const remainingTime = Math.max(0, parseInt(storedLockTime) - Date.now());
      if (remainingTime > 0) {
        setIsLocked(true);
        setLockTimer(Math.ceil(remainingTime / 1000));
      } else {
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockTime');
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isLocked) {
      interval = setInterval(() => {
        setLockTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockTime');
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onLogin= async(event)=>{
    event.preventDefault();
    if (isLocked) {
      setErrorMessage(`Mohon tunggu ${lockTimer} detik sebelum mencoba lagi.`);
      setShowErrorPopup(true);
      return;
    }

    let newUrl = url;
    if (currstate==="Login"){
      newUrl += "/api/user/login"
    }
    else{
      newUrl += "/api/user/register"
    }

    try {
      const response = await axios.post(newUrl,data);
      if (response.data.success) {
        if (currstate === "Sign up") {
          setSignUpSuccess(true);
          setCurrState("Login");
          setData({...data, password: ""});
          setErrorMessage("Pendaftaran berhasil. Silakan login.");
          setShowErrorPopup(true);
        } else {
          setToken(response.data.token);
          localStorage.setItem("token",response.data.token);
          setShowLogin(false);
          setLoginAttempts(0);
          localStorage.removeItem('loginAttempts');
        }
      }
      else{
        handleLoginFailure();
      }
    } catch (error) {
      handleLoginFailure();
    }
  }

  const handleLoginFailure = () => {
    setLoginAttempts((prevAttempts) => {
      const newAttempts = prevAttempts + 1;
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(60); // 1 menit dalam detik
        const lockTime = Date.now() + 60 * 1000;
        localStorage.setItem('lockTime', lockTime.toString());
        
        setErrorMessage(`Anda telah salah login 5 kali. Mohon tunggu 1 menit sebelum mencoba lagi.`);
        setShowErrorPopup(true);
      } else {
        setErrorMessage(`Login gagal. Anda telah mencoba ${newAttempts} kali dari 5 percobaan yang diizinkan.`);
        setShowErrorPopup(true);
      }
      
      return newAttempts;
    });
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const closeLoginPopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowLogin(false);
      document.body.style.overflow = 'unset';
    }, 300); // Sesuaikan dengan durasi animasi
  }

  return (
    <div className={`login-popup ${isClosing ? 'closing' : ''}`} ref={popupRef}>
      <form onSubmit={onLogin} className={`login-popup-container ${isClosing ? 'closing' : ''}`} ref={containerRef}>
        <div className="login-popup-title">
            <h2>{currstate}</h2>
            <img onClick={closeLoginPopup} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          <div className={`input-wrapper ${currstate === "Sign up" ? "visible" : "hidden"}`}>
            <input 
              name='name' 
              onChange={onChangeHandler} 
              value={data.name} 
              type="text" 
              placeholder='Nama Anda' 
              required={currstate === "Sign up"}
            />
          </div>
          <div className="input-wrapper visible">
            <input 
              name='email' 
              onChange={onChangeHandler} 
              value={data.email} 
              type="email" 
              placeholder='Email Anda' 
              required 
            />
          </div>
          <div className="input-wrapper visible">
            <div className="password-input-container">
              <input 
                name='password' 
                onChange={onChangeHandler} 
                value={data.password} 
                type={showPassword ? "text" : "password"} 
                placeholder='Kata Sandi Anda' 
                required 
              />
              <button type="button" className="show-password-button" onClick={toggleShowPassword}>
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
          </div>
        </div>
        <button type='submit'>{currstate === "Sign up" ? "Daftar" : "Masuk"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>Dengan melanjutkan, saya menyetujui syarat penggunaan & kebijakan privasi.</p>
        </div>
        {currstate === "Login" && !signUpSuccess
          ? <p>Belum punya akun? <span onClick={()=>setCurrState("Sign up")}>Daftar di sini</span></p>
          : <p>Sudah punya akun? <span onClick={()=>setCurrState("Login")}>Masuk di sini</span></p>
        }  
      </form>
      {showErrorPopup && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setShowErrorPopup(false)}>Oke</button>
        </div>
      )}
    </div>
  )
}

export default LoginPopup
