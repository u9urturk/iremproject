import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='container mx-auto px-[5%]'>
      <Outlet></Outlet>
    </div>
  )
}
