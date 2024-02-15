import React from 'react'
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { Link, Outlet } from 'react-router-dom';


export default function DevDash() {
    return (
        <div className='pt-10  animate-fade-left animate-ease-in-out animate-normal   w-full h-auto flex items-center justify-center' >
            <div className=' flex flex-row items-start justify-between max-w-[calc(90%)] h-screen rounded-[3rem] w-full bg-gray-100'>
                <div className='relative w-1/4'>
                    <div className='absolute -left-8 -top-8 bg-brandGreen max-w-xs w-auto h-screen rounded-[3rem]'>
                        <div className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                            <MdOutlineDashboardCustomize size={24}></MdOutlineDashboardCustomize>
                            Yönetici Paneli
                        </div>
                        <ul className="menu bg-transparent flex items-start justify-center text-white w-56 rounded-box">
                            <li><Link to={"kategoriislemleri"}>Kategori İşlemleri</Link></li>
                            <li><Link to={"ozellikislemleri"} >Özellik İşlemleri</Link></li>
                            <li><Link to={"urunislemleri"} >Ürün İşlemleri</Link></li>
                            <li><Link to={"kullaniciislemleri"} >Kullanıcı İşlemleri</Link></li>
                        </ul>

                    </div>
                </div>
                <div className='h-full py-8 pr-8 flex items-center justify-center w-3/4'>
                    <Outlet></Outlet>
                </div>
            </div>

        </div>
    )
}
