import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import LoginPopup from './components/LoginPopup/LoginPopup';

function App() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <Navbar setShowLogin={setShowLogin} showLogin={showLogin} />
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
            {/* ... komponen lainnya ... */}
        </>
    );
}

export default App;
