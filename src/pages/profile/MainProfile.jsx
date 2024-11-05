import React from 'react'
import { Outlet } from 'react-router-dom'

export default function MainProfile() {
  return (
    <div className='w-full flex items-start shadow-inner rounded-xl pl-8 my-24 justify-center  h-auto'>
      <div className='w-[20%] h-full pt-8'>
        <ul className='flex flex-col gap-y-4 font-semibold opacity-60'>
          <li className='cursor-pointer hover:scale-110 transition-transform'>Favoriler</li>
          <li className='cursor-pointer hover:scale-110 transition-transform'>Siparişler</li>
          <li className='cursor-pointer hover:scale-110 transition-transform'>İadeler</li>
          <li className='cursor-pointer hover:scale-110 transition-transform'>Adreslerim</li>
          <li className='cursor-pointer hover:scale-110 transition-transform'>Bildirimlerim</li>
        </ul>
      </div>
      <div className='w-[80%] flex items-center pb-8 rounded-r-xl justify-center h-auto bg-base-300'>
        <Outlet></Outlet>
      </div>
    </div>
  )
}
