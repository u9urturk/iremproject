import React from 'react'
import { BsBell } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'

export default function Navbar() {
    const logo = process.env.PUBLIC_URL + "logos/logo.svg"

    return (
        <div className='w-full body-font h-auto flex flex-col items-center justify-center bg-gray-50'>
            <div className='w-full flex  md:flex-row flex-col  items-center justify-around  py-3 bg-gradient-to-tl from-[#b7bac3] to-[#6e77ee] '>
                <div className='flex items-center justify-center gap-x-2 pb-4 md:pb-0' >
                    <img className='w-auto h-20 ' src={logo} alt="logo" />
                    <span class="ml-3 text-xl  text-[#f9faf5]">İrem Aksesuar</span>

                </div>
                <div className='flex border border-gray-300 md:-translate-x-16  py-1 px-2 rounded-2xl items-center justify-center gap-x-2'>
                    <div className='text-white '><CiSearch size={24}></CiSearch></div>
                    <input className='w-56 outline-none text-white bg-transparent   rounded-lg'  placeholder='Ürün arayın...' type="text" />
                </div>
                <div className='text-gray-300 hidden md:block cursor-pointer transition-all hover:text-gray-700'>
                    <BsBell size={24}></BsBell>
                </div>
            </div>
            <div className=' w-[calc(100%-200px)]'></div>
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>
                <div className='hover:bg-[#e4e4e4] cursor-pointer transition-all py-1 px-2 rounded-md'>Kategori 1</div>
                <div className='hover:bg-[#e4e4e4] cursor-pointer transition-all py-1 px-2 rounded-md'>Kategori 2</div>
                <div className='hover:bg-[#e4e4e4] cursor-pointer transition-all py-1 px-2 rounded-md'>Kategori 3</div>
                <div className='hover:bg-[#e4e4e4] cursor-pointer transition-all py-1 px-2 rounded-md'>Kategori 4</div>
                <div className='hover:bg-[#e4e4e4] cursor-pointer transition-all py-1 px-2 rounded-md'>Kategori 5</div>
            </div>
        </div>
    )
}
