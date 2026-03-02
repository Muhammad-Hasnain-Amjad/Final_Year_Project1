import React from 'react'
import crossicon from '../assets/cross_icon.png'
import Home from '../Pages/Home'
import { Navigate, useNavigate } from 'react-router-dom';
function ShowModel({isopen,setisopen,children}) {
    const navigate=useNavigate()
   
    if(!isopen){
        return null;
    }
    const handleClose = () => {
    setisopen(false);
    navigate("/"); // navigate to home page
  };
  return (
    <div className='parentdiv'>
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
   <img
      src={crossicon}
      alt="close"
      className="absolute top-2 right-2 cursor-pointer w-6 h-6"
      onClick={handleClose}
 

    />
    
    {children}
</div>

    </div>
  )
}

export default ShowModel