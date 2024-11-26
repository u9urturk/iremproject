import React, { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import Login from './Login'
import logo from '../materials/logos/logo.svg'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { LuShoppingCart } from "react-icons/lu";
import { LuUserCog } from "react-icons/lu";
import { useCart } from '../context/CartContext'
import { MdExpandLess, MdExpandMore } from "react-icons/md";




export default function Navbar() {

    const user = useSelector(state => state.auth.user)
    const isAdmin = useSelector(state=>state.auth.isAdmin)
    const [scrollY, setScrollY] = useState(0);
    const { items, totalQuantity, totalAmount, removeFromCart, clearCart, updateQantityFromCart } = useCart();



    const handleScroll = () => {
        setScrollY(window.scrollY);
    };



    const drawerRef = useRef(null);

    const closeDrawer = () => {
        if (drawerRef.current) {
            drawerRef.current.checked = false;
        }
    };


    useEffect(() => {

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <div
                className={classNames({
                    "fixed z-[5]  duration-1000 pt-4 md:pt-1 w-full body-font h-20 flex flex-col items-center justify-center  transition-all": true,

                    "bg-gradient-to-b from-base-300 bg-base-100 transition-all h-24 ": scrollY !== 0,

                })}
            >
                <div className='w-full flex items-center relative   md:flex-row flex-col   justify-around  py-3 '>
                    <Link to={"/"} className='flex items-center justify-center gap-x-2 pb-4 md:pb-0' >
                        <img className='w-auto h-24' src={logo} alt="logo" />
                        <span className="ml-3 text-3xl text-brandPink font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz & Nakış Evi</p></span>

                    </Link>
                    <div className='hidden shadow-inner shadow-base-300  lg:-translate-x-16  py-3 px-3 rounded-lg items-center justify-center '>
                        <div className='text-brandPink '><CiSearch size={24}></CiSearch></div>
                        <input className='w-56 outline-none pl-2 text-brandPink placeholder:text-brandPink bg-transparent  rounded-lg' placeholder='Ürün arayın...' type="text" />
                    </div>
                    <div className=' hidden md:flex items-center justify-center gap-x-8 text-sm font-semibold'>
                        <Link className='hover:scale-110 transition-transform'>Kategoriler</Link>
                        <Link className='hover:scale-110 transition-transform'>Ürünler</Link>
                        <Link className='hover:scale-110 transition-transform'>Galeri</Link>
                        <Link className='hover:scale-110 transition-transform'>Hakkında</Link>
                    </div>

                    <ul className="fixed md:static md:h-full md:flex items-center justify-center md:bg-transparent   bg-opacity-70 bottom-0 menu menu-horizontal bg-base-300 rounded-box mt-6 md:mt-0">
                        <li  >
                            <Link to={`/`} className="tooltip md:tooltip-bottom" data-tip="Ana Sayfa">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/yöneticipaneli"}
                                className={`tooltip  md:tooltip-bottom ${isAdmin ? "block" : "hidden"}`} data-tip="Yönetim Paneli">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </Link>
                        </li>
                        <div>
                            <div className="drawer ">
                                <input id="basket-cart" ref={drawerRef} type="checkbox" className="drawer-toggle " />
                                <div className="drawer-content">
                                    {/* Page content here */}
                                    <label htmlFor="basket-cart">
                                        <li>
                                            <div className='indicator'>
                                                <LuShoppingCart size={22} />
                                                <span className="indicator-item text-xs opacity-85 badge badge-secondary">{totalQuantity}</span>
                                            </div>
                                        </li>
                                    </label>
                                </div>
                                <div className="drawer-side z-[1] ">
                                    <label htmlFor="basket-cart" aria-label="close sidebar" className="drawer-overlay"></label>
                                    <ul className="menu bg-base-200  text-base-content min-h-full w-80 p-4">
                                        <div className='space-y-2 my-8 mx-2'>
                                            <div className='flex items-center justify-between'>
                                                <div className='font-semibold  text-3xl mb-2 opacity-80 text-accent-content'>Sepet</div>
                                                <button onClick={clearCart} className='btn btn-sm rounded-md btn-outline '>Sepeti Temizle</button>
                                            </div>
                                            <div className='divider'>Toplam</div>
                                            <div className='flex items-center justify-between px-2'>
                                                <strong>Ödenecek Tutar :</strong>
                                                <strong>{totalAmount}₺</strong>
                                            </div>
                                            <Link to={"checkoutsummary"} onClick={closeDrawer} disabled={items.length > 0 ? false : true} className='btn rounded-md btn-primary w-full'>Siparişi Oluştur</Link>
                                        </div>

                                        {
                                            items.length > 0 ? (
                                                items.map((item) => (
                                                    <li key={item.id} className="w-full mb-4">
                                                        <div className="w-full rounded-lg  shadow bg-base-100 flex items-center justify-between">
                                                            <div>
                                                                <img className='object-cover rounded-md w-20 h-20' src={item.baseImage} alt={item.name} />

                                                            </div>
                                                            <div className="flex items-center justify-center gap-x-5">
                                                                <div className="flex flex-col items-center justify-center">
                                                                    <strong>{item.name}</strong>
                                                                    <span className='opacity-70 font-medium'>{item.basePrice}₺</span>
                                                                </div>
                                                                <div className="flex items-center justify-center gap-x-4">
                                                                    <p className="flex items-center flex-col justify-center gap-y-1">
                                                                        <MdExpandLess className='cursor-pointer hover:scale-125 hover:bg-base-100 rounded-full transition-transform' size={24} onClick={() => { updateQantityFromCart(item.id, item.quantity, "INCREASE") }} />
                                                                        <span className="font-semibold">{item.quantity}</span>
                                                                        <MdExpandMore className='cursor-pointer hover:scale-125 hover:bg-base-100 rounded-full transition-transform' size={24} onClick={() => { updateQantityFromCart(item.id, item.quantity, "REDUCE") }} />
                                                                    </p>
                                                                    <p onClick={() => { removeFromCart(item.id) }} className="text-warning hover:text-success transition-colors font-semibold">Kaldır</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <div className="w-full rounded-lg h-16   shadow bg-base-100 flex items-center justify-center"><p className='opacity-70'>Sepetinizde ürün bulunmamakta.</p></div>
                                            )
                                        }


                                    </ul>

                                </div>
                            </div>
                        </div>

                        <li className={`${user ? "block" : "hidden"} tooltip md:tooltip-bottom`} data-tip={"Profile"}>
                            <Link to={"profile"}>
                                <LuUserCog size={22} />
                            </Link>
                        </li>
                        <li>
                            <div className="tooltip md:tooltip-bottom" data-tip={user ? "Çıkış yap " : "Giriş yap"}>
                                <Login></Login>
                            </div>
                        </li>
                    </ul>

                </div>
            </div >


        </div >
    )
}
