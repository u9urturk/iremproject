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
                    "fixed z-[1]  bg-base-100 pt-14 md:pt-1 w-full body-font h-20 flex flex-col items-center justify-center  transition-all": true,
                    "opacity-0": scrollY != 0,

                })}
            >
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

                            <Link to={"/yöneticipaneli"} className={classNames({
                                'text-brandPink tooltip md:static absolute left-12 top-5 block cursor-pointer transition-all p-3 rounded-full hover:bg-base-200':user,
                                'hidden':user==false
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
                </div>

            </div>
            <div className='w-full h-20 mb-16 md:mb-3'>

            </div>
        </div>
    )
}
