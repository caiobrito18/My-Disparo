import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Disparo from '../pages/Disparo'
import Instancias from '../pages/Instancias'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Disparo/>}/>
          <Route path='/instancias' element={<Instancias/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router