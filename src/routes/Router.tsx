import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Disparo from '../pages/Disparo'
import Instancias, { Instance } from '../pages/Instancias'

const Router = () => {
  // @ts-ignore
  let instancias = [""]

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Disparo />}/>
          {/* @ts-ignore */}
          <Route path='/instancias' element={<Instancias instancias={instancias}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router