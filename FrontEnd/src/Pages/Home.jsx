import React from 'react'
import NavBar from '../Components/NavBar'
import banner from '../assets/banner.jpg'
import Header from '../Components/Header'
import Special from '../Components/Special'
import Footer from '../Components/Footer'
import ProfReg from '../Components/ProfReg'
import WorkflowSection from '../Components/WorkflowSection'
const Home = () => {
  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide">
        <NavBar />
  <Header />
 <Special />
 <ProfReg />
<WorkflowSection />
 <Footer />
    </div>
  )
}

export default Home
