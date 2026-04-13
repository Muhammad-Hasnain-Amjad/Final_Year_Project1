import { useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './Pages/Home';
import Dr from './Pages/Dr'
import LawyerProfile from './Pages/LawyerProfile';
import Lawyers from './Pages/Lawyers'
import About from './Pages/About'
import Contactus from './Pages/Contactus'
import Login from './Pages/Login';
import MyProfile from './Pages/MyProfile';
import  MyAppointments from './Pages/MyAppointments' 
import Dr_Reg from './Pages/Dr_Reg';
import NotFound from './Pages/NotFound';
import Law_Reg from './Pages/Law_Reg';
import Signup from './Pages/Signup';
import View_Lawyer_Profile from  './Lawyers_files/View_Lawyer_Profile'
import LawyerAppointments from './Lawyers_files/LawyerAppointments';
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
  path:"/doctors",
  element:(
    <div>
      <Dr />
    </div>
  )
 },
 {
  path:"/lawyers",
  element:(
    <div>
      <Lawyers />
    </div>
  )
 },
 {
  path:"/about",
  element:(
    <div>
      <About />
    </div>
  )
 },
 {
  path:"/contactus",
  element:(
    <div>
      <Contactus />
    </div>
  )
 },
 {
  path:"/login",
  element:(
    <div>
      <Login />
    </div>
  )
 },
 {
  path:"/signup",
  element:(
    <div>
      <Signup />
    </div>
  )
 },
 {
  path:"/myprofile",
  element:(
    <div>
      <MyProfile />
    </div>
  )
 },
 {
  path:"/myappointments",
  element:(
    <div>
      <MyAppointments />
    </div>
  )
 },
  {
  path:"drform",
  element:(
    <div>
      <Dr_Reg />
    </div>
  )
 },
  {
  path:"lawyerform",
  element:(
    <div>
      <Law_Reg />
    </div>
  )
 },
 {
  path:"/lawyer/:id",
  element:(
    <div>
<View_Lawyer_Profile />
    </div>
  )
 },
  {
      path: "/lawyers_a/:id",  // This route was missing!
      element: <LawyerProfile />
    },
    {
      path:"/appointments",
      element:(
        <div>
          <LawyerAppointments />
        </div>
      )
    },
    {
      path: "*",
      element: <NotFound />
    }
])

  return (
    <>
     <div >
      

       <RouterProvider router={route}>
 
      </RouterProvider>
     </div>
       
    </>
  )
}

export default App
