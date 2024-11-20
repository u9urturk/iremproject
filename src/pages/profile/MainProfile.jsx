import { ShoppingBasketIcon } from 'lucide-react'
import React from 'react'
import { FaRegAddressCard } from 'react-icons/fa'
import { LuUserCog } from 'react-icons/lu'
import { MdFavorite, MdNotifications } from 'react-icons/md'
import { Link, Outlet } from 'react-router-dom'

export default function MainProfile() {
  return (
    <>
      <div className='w-full container flex items-start shadow-inner rounded-xl md:my-24 justify-start  h-auto'>
        <div className='w-[10%] px-4 h-full sticky top-20 pt-8'>
          <ul className='flex flex-col gap-y-4  font-semibold opacity-60'>
            <Link className='cursor-pointer flex flex-col items-center justify-center hover:scale-110 transition-transform' to={"/profile"}>
              <LuUserCog  size={24} /><p className='hidden md:block'>Profil</p>
            </Link>
            <li className='cursor-pointer flex flex-col items-center justify-center hover:scale-110 transition-transform' >
              <MdFavorite size={24}></MdFavorite><p className='hidden md:block'>Favoriler</p>
            </li>
            <Link to={"orders"} className='cursor-pointer flex flex-col items-center justify-center hover:scale-110 transition-transform'>
              <ShoppingBasketIcon size={24}></ShoppingBasketIcon><p className='hidden md:block'>Siparişler</p>
            </Link>
            <li className='cursor-pointer  flex-col items-center  justify-center hidden hover:scale-110 transition-transform'>İadeler</li>
            <Link to={"address"} className='cursor-pointer flex flex-col items-center  hover:scale-110 transition-transform' >
              <FaRegAddressCard size={24}></FaRegAddressCard><p className='hidden md:block'>Adreslerim</p>
            </Link>
            <li className='cursor-pointer flex flex-col items-center justify-center hover:scale-110 transition-transform'>
              <MdNotifications size={24}></MdNotifications><p className='hidden md:block'>Bildirimlerim</p>
            </li>
          </ul>
        </div>
        <div className='w-[90%] flex items-center pb-8 rounded-r-xl justify-center h-auto bg-base-300'>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  )
}
