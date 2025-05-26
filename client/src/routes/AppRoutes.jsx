import Header from '@/components/custom/navbar'
import RegisterTemplate from '@/pages/signup/RegisterTemplate'
import Unauthorized from '@/pages/unauthorized'
import ProtectedRoutes from './ProtectedRoutes' // <- Make sure this path is correct
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/home'
import Player from '@/modals/Player'

function AppRoutes() {
  return (
    <div>
      <Header />
      <Routes>
        {/* Public Route */}
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route path='/' element={<RegisterTemplate />} />

        {/* Protected Routes */}
        <Route 
          path='/home' 
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          } 
       />

       <Route 
          path='/player/:uploadedBy/:title' 
          element={
            <ProtectedRoutes>
              <Player />
            </ProtectedRoutes>
          } 
       />
      </Routes>
    </div>
  )
}

export default AppRoutes
