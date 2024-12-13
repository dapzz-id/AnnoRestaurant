import React, { useState, useContext, useEffect, useRef } from 'react'
import './Search.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import Typewriter from 'typewriter-effect'

const Search = () => {
  const [query, setQuery] = useState(localStorage.getItem('searchQuery') || '')
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('searchResults')) || [])
  const { food_list } = useContext(StoreContext)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [food_list])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSearch = () => {
    const filteredResults = food_list.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filteredResults)
    localStorage.setItem('searchQuery', query)
    localStorage.setItem('searchResults', JSON.stringify(filteredResults))
  }

  return (
    <div className="search-container">
      <div className="search-input-container">
        <div className="typewriter-container">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .changeDelay(30) // Mengubah delay antar karakter menjadi 30ms
                .changeDeleteSpeed(1) // Mempercepat kecepatan penghapusan jika diperlukan
                .typeString('Mau makan apa hari ini? 😋')
                .callFunction(() => {
                  setTypewriterComplete(true)
                  inputRef.current.focus()
                })
                .start()
            }}
            options={{
              cursor: '',
              loop: false,
              delay: 30, // Mengatur delay default menjadi 30ms
            }}
          />
        </div>
        <input 
          ref={inputRef}
          type="text" 
          value={query} 
          onChange={handleInputChange} 
          placeholder="Cari makanan..." 
          style={{ marginTop: typewriterComplete ? '10px' : '0' }}
        />
      </div>
      <button onClick={handleSearch}>Cari</button>
      <hr />
      <div className="search-results" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
        {results.length > 0 ? (
          results.map((item, index) => (
            <div style={{ flex: '0 1 calc(25% - 10px)', boxSizing: 'border-box' }} key={index}>
              <FoodItem 
                id={item._id} 
                name={item.name} 
                description={item.description} 
                price={item.price} 
                image={item.image} 
              />
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p>Harap masukkan nama makanan yang ingin dicari dan tersedia di daftar makanan kami</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
