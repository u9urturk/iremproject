import React, { useEffect, useState } from 'react'
import { BsBell } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import Login from './Login'
import logo from '../materials/logos/logo.svg'
import { AiOutlineHome } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useSelector } from 'react-redux'
export default function Navbar() {

    const user = useSelector(state => state.auth.user)
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
        setScrollY(window.scrollY);
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
<<<<<<< HEAD
                    "fixed z-[5]   duration-1000 pt-4 md:pt-1 w-full body-font h-20 flex flex-col items-center justify-center  transition-all": true,
=======
                    "fixed z-[1]   duration-1000 pt-4 md:pt-1 w-full body-font h-20 flex flex-col items-center justify-center  transition-all": true,
>>>>>>> cc6b3c10edcff22eb1436e6cb57dac59b37509aa

                    "bg-gradient-to-b from-base-300 bg-base-100 transition-all h-24 ": scrollY != 0,

                })}
            >
                <div className='w-full flex relative   md:flex-row flex-col  items-center justify-around  py-3 '>
                    <div className='flex items-center justify-center gap-x-2 pb-4 md:pb-0' >
                        <img className='w-auto h-24' src={logo} alt="logo" />
                        <span class="ml-3 text-3xl text-brandPink font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz Evi</p></span>

                    </div>
                    <div className='hidden md:flex border-2 border-base-200 md:-translate-x-16  py-1 px-2 rounded-2xl items-center justify-center '>
                        <div className='text-brandPink '><CiSearch size={24}></CiSearch></div>
                        <input className='w-56 outline-none pl-2 text-brandPink placeholder:text-brandPink bg-transparent  rounded-lg' placeholder='Ürün arayın...' type="text" />
                    </div>
                    <div className='hidden md:block'>
                        <div className='flex items-center justify-center '>
<<<<<<< HEAD
                            <Link to={"/"} className='text-brandPink tooltip md:static absolute left-12 top-5 block cursor-pointer transition-all p-3 rounded-full hover:bg-base-200' data-tip="AnaSayfa" >
=======
                        <Link to={"/"} className='text-brandPink tooltip md:static absolute left-12 top-5 block cursor-pointer transition-all p-3 rounded-full hover:bg-base-200' data-tip="AnaSayfa" >
>>>>>>> cc6b3c10edcff22eb1436e6cb57dac59b37509aa
                                <AiOutlineHome size={24}></AiOutlineHome>
                            </Link>

                            <Link to={"/yöneticipaneli"} className={classNames({
<<<<<<< HEAD
                                'text-brandPink tooltip md:static absolute left-12 top-5 block cursor-pointer transition-all p-3 rounded-full hover:bg-base-200': user,
                                'hidden': user == false
=======
                                'text-brandPink tooltip md:static absolute left-12 top-5 block cursor-pointer transition-all p-3 rounded-full hover:bg-base-200':user,
                                'hidden':user==false
>>>>>>> cc6b3c10edcff22eb1436e6cb57dac59b37509aa
                            })} data-tip="Yönetici Paneli" >
                                <MdOutlineDashboardCustomize size={24}></MdOutlineDashboardCustomize>
                            </Link>

                            <div className='text-brandPink  tooltip  md:static absolute left-3 top-5 block cursor-pointer  p-3 rounded-full hover:bg-base-200' data-tip="Bildirimler">
                                <BsBell size={23}></BsBell>
                            </div>
                            <div className='flex items-center justify-center md:static   p-3 rounded-full hover:bg-base-200'>
                                <Login></Login>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD

                    <ul className="fixed bg-opacity-70 bottom-0 menu menu-horizontal bg-base-200 rounded-box mt-6">
                        <li>
                            <a className="tooltip" data-tip="Ana Sayfa">
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
                            </a>
                        </li>
                        <li>
                            <a className="tooltip" data-tip="Bilgilendirme">
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
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a className="tooltip" data-tip="Yönetim Paneli">
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
                            </a>
                        </li>
                    </ul>
=======
>>>>>>> cc6b3c10edcff22eb1436e6cb57dac59b37509aa
                </div>

            </div>
            <div className='w-full h-20 mb-16 md:mb-3'>

            </div>
        </div>
    )
}
