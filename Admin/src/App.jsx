import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLayout from './Components/AdminLayout' // Import the new layout
import Home from './Pages/Home'
import All_Drs from './Pages/All_Drs'
import All_Lawyers from './Pages/All_Lawyers'
import Temp_lawyer from './Pages/Temp_lawyer'
import './App.css'

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Home />
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
      path: "/doctors_a",
      element: (
        <AdminLayout>
          <All_Drs />
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
    }
  ])
  
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  )
}

export default App