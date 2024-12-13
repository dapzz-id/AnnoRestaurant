import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import UpcomingMenu from '../../components/UpcomingMenu/UpcomingMenu'
import AppDownload from '../../components/AppDownload/AppDownload'
import Information from '../../components/Information/Information'

const Home = () => {

const [category,setCategory] = useState("All")

  return (
    <div>
      < Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <UpcomingMenu/>
      <Information/>
      <AppDownload/>
    </div>
  )
}

export default Home