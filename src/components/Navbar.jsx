import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import Login from './Login'
import logo from '../materials/logos/logo.svg'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { LuShoppingCart } from "react-icons/lu";
import { isAdmin } from '../firebase'
import { LuUserCog } from "react-icons/lu";



export default function Navbar() {

    const user = useSelector(state => state.auth.user)
    const [scrollY, setScrollY] = useState(0);
    const [isAdminUser, setIsAdminUser] = useState(false)

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };
    useEffect(() => {
        if (user) {
            isAdmin(user?.uid).then(res => {
                if (res === true) {
                    setIsAdminUser(true);
                } else {
                    setIsAdminUser(false);
                }
            })
        } else if (user === null) {
            setIsAdminUser(false)
        }


    }, [user])


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
                        <span class="ml-3 text-3xl text-brandPink font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz & Nakış Evi</p></span>

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

                    <ul className="fixed md:static md:h-full md:flex items-center justify-center md:bg-transparent   bg-opacity-70 bottom-0 menu menu-horizontal bg-base-200 rounded-box mt-6 md:mt-0">
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
                                className={`tooltip  md:tooltip-bottom ${isAdminUser ? "block" : "hidden"}`} data-tip="Yönetim Paneli">
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
                        <li className='tooltip md:tooltip-bottom' data-tip={"Sepetim"}>
                            <Link>
                                <LuShoppingCart size={22} />
                            </Link>
                        </li>
                        <li  className={`${user?"block":"hidden"} tooltip md:tooltip-bottom`} data-tip={"Profile"}>
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
            </div>
        </div>
    )
}
