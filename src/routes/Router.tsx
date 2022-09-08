import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Disparo from '../pages/Disparo'

const Router = () => {


  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Disparo />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router