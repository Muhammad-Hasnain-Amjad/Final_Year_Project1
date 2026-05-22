import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLayout from './Components/AdminLayout' // Import the new layout
import Home from './Pages/Home'
import All_Lawyers from './Pages/All_Lawyers'
import Temp_lawyer from './Pages/Temp_lawyer'
import './App.css'
import Login from './Pages/Login'
import All_Appoint from "./Pages/All_Appoint";
import AppointmentDetails from "./Components/AppointmentDetails";
import AllUsers from "./Pages/AllUsers";
function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Login />
        </div>
      )
    },
    {
      path: "/admin",
      element: (
        <AdminLayout>
          <Home />
        </AdminLayout>
      )
    },
    {
      path: "/appointments",
      element: (
        <AdminLayout>
          <All_Appoint />
        </AdminLayout>
      )
    },
    {
      path: "/lawyers_a",
      element: (
        <AdminLayout>
          <All_Lawyers />
        </AdminLayout>
      )
    },
    {
      path: "/lawyers_a/:id",
      element: (
        <AdminLayout>
          <Temp_lawyer />
        </AdminLayout>
      )
    },
    {
      path: "/appointments/:id",
      element: (
        <AdminLayout>
          <AppointmentDetails />
        </AdminLayout>
      )
    },
    {
      path:"/users_a",
      element:(
        <AdminLayout>
          <AllUsers />
        </AdminLayout>
      )
    }
  ])
  
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  )
}

export default App