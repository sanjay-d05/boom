import React from 'react' ;
import './App.css' ;
import Header from './components/custom/navbar';
import { Route, Routes } from 'react-router-dom';
import RegisterTemplate from './pages/signup/RegisterTemplate';
import axios from 'axios' ;
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

// middleware
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URI ;
axios.defaults.withCredentials = true ;

function App() {
  return (
    <div>
      <Toaster position='bottom-right' />
      <AppRoutes />
    </div>
  )
}

export default App