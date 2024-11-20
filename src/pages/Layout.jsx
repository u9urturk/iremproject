import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='container mx-auto py-24'>
      <Outlet></Outlet>
    </div>
  )
}
