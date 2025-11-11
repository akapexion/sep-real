import React from 'react'
import UINavbar from './components/UINavbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

const AppLayout = () => {
  return (
    <>
        <UINavbar/>

        <Outlet/>

        <Footer/>
    </>
  )
}

export default AppLayout
