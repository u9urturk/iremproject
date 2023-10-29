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
        <div className='w-full body-font h-auto flex flex-col items-center justify-center'>
            <div className='w-full flex relative   md:flex-row flex-col  items-center justify-around  py-3 '>
                <div className='flex items-center justify-center gap-x-2 pb-4 md:pb-0' >
                    <img className='w-auto h-24' src={logo} alt="logo" />
                    <span class="ml-3 text-3xl text-brandPink font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz Evi</p></span>

                </div>
                <div className='flex  border-2 border-base-200 md:-translate-x-16  py-1 px-2 rounded-2xl items-center justify-center '>
                    <div className='text-brandPink '><CiSearch size={24}></CiSearch></div>
                    <input className='w-56 outline-none pl-2 text-brandPink placeholder:text-brandPink bg-transparent  rounded-lg' placeholder='Ürün arayın...' type="text" />
                </div>
                <div className='hidden md:block'>
                    <div className='flex items-center justify-center '>
                        <Link to={"/"} className='text-brandPink tooltip md:static absolute left-12 top-5 block cursor-pointer transition-all p-3 rounded-full hover:bg-base-200' data-tip="AnaSayfa" >
                            <AiOutlineHome size={24}></AiOutlineHome>
                        </Link>

                        <div className='text-brandPink  tooltip  md:static absolute left-3 top-5 block cursor-pointer  p-3 rounded-full hover:bg-base-200' data-tip="Bildirimler">
                            <BsBell size={23}></BsBell>
                        </div>
                        <div className='flex items-center justify-center md:static   p-3 rounded-full hover:bg-base-200'>
                            <Login></Login>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>

                <Categories></Categories>

            </div>
        </div>
    )
}
