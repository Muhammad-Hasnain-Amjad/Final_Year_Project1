import { useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import All_Drs from './Pages/All_Drs'
import All_Lawyers from './Pages/All_Lawyers'
import './App.css'
import Temp_lawyer from './Pages/Temp_lawyer'
function App() {
const route=createBrowserRouter([
 {
   path:"/",
    element:(
      <div>
        <Home />
        
      </div>
    )
 },{
  path:"/doctors_a",
  element:(
    <div>
      <All_Drs />
    </div>
  )
 },
 {
  path:"/lawyers_a",
  element:(
    <div>
      <All_Lawyers />
    </div>
  )
 },
 {
  path:"/lawyers_a/:id",
  element:(
    <div>
      <Temp_lawyer />
    </div>
  )
 }
  
])
  return(
    <div>
      <RouterProvider router={route}>
 
      </RouterProvider>

    </div>
  );
}

export default App
