import React from 'react'
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { Link, Outlet } from 'react-router-dom';


export default function DevDash() {
    return (
        <div className='pt-10 bg-200 relative  w-full h-auto flex items-center justify-center ' >
            <div className='h-full flex items-center justify-center w-[90%]'>
                <Outlet></Outlet>
            </div>

            <div className="drawer absolute left-0 z-10 top-0 w-full ">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" data-tip="İşlemler" className='z-0 cursor-pointer tooltip tooltip-top'>  <MdOutlineDashboardCustomize size={24}></MdOutlineDashboardCustomize></label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <ul className="menu font-semibold   bg-transparent flex items-start justify-center  w-56 rounded-box">
                            <li><Link to={"kategoriislemleri"}>Kategori İşlemleri</Link></li>
                            <li><Link to={"ozellikislemleri"} >Özellik İşlemleri</Link></li>
                            <li><Link to={"urunislemleri"} >Ürün İşlemleri</Link></li>
                            <li><Link to={"kullaniciislemleri"} >Kullanıcı İşlemleri</Link></li>
                        </ul>
                    </ul>
                </div>
            </div>
        </div>
    )
}
