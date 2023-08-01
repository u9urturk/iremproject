import React from 'react'
import { BsBell } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import Login from './Login'
import Categories from './Categories'
import logo from '../materials/logos/logo.svg'
import { AiOutlineHome } from 'react-icons/ai'
import { Link } from 'react-router-dom'
export default function Navbar() {






    return (
        <div className='w-full body-font h-auto flex flex-col items-center justify-center bg-gray-50'>
            <div className='w-full flex relative   md:flex-row flex-col  items-center justify-around  py-3 bg-gradient-to-tl from-brandGray to-brandBlue'>
                <div className='flex items-center justify-center gap-x-2 pb-4 md:pb-0' >
                    <img className='w-auto h-20 ' src={logo} alt="logo" />
                    <span class="ml-3 text-xl  text-brandWhite">İrem Aksesuar</span>

                </div>
                <div className='flex border border-brandGray md:-translate-x-16  py-1 px-2 rounded-2xl items-center justify-center gap-x-2'>
                    <div className='text-brandWhite '><CiSearch size={24}></CiSearch></div>
                    <input className='w-56 outline-none text-brandWhite bg-transparent  rounded-lg' placeholder='Ürün arayın...' type="text" />
                </div>
                <div className='flex items-center justify-center gap-x-6'>
                    <Link  to={"/"} className='text-brandWhite md:static absolute left-12 top-5 block cursor-pointer transition-all hover:text-gray-700'>
                        <AiOutlineHome size={24}></AiOutlineHome>
                    </Link>

                    <div className='text-brandWhite   md:static absolute left-3 top-5 block cursor-pointer hover:text-gray-700'>
                        <BsBell size={24}></BsBell>
                    </div>
                    <div className='absolute md:static right-3 top-4'>
                        <Login></Login>
                    </div>
                </div>
            </div>
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>

                <Categories></Categories>

            </div>
        </div>
    )
}
