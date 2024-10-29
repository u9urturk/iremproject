import React from 'react'
import logo from '../materials/logos/logo.svg'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer class="body-font flex items-center justify-center flex-col">


            <div className="footer w-full flex items-center justify-around  bg-base-100 text-neutral-content p-10">
                <nav>
                    <div class="flex title-font font-medium items-center md:justify-start justify-center text-brandPink">
                        <img className='w-auto h-24 ' src={logo} alt="logo" />
                        <span class="ml-3 text-3xl text-brandPink font-serif font-extrabold tracking-tight place-items-end justify-center flex gap-x-1">İrem <p className='text-brandGreen text-xs'> Çeyiz Evi</p></span>
                    </div>

                </nav>
                <nav className='flex items-center justify-center'>

                    <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                        <div class="text-brandPink">
                            <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                        </div>
                        <div class="ml-3 text-brandPink">
                            <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </div>
                        <div class="ml-3 text-brandPink">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </div>

                    </span>

                    <p class="text-sm text-brandPink sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-base-200 sm:py-2 sm:mt-0 mt-4">© 2023 Iremceyizevi —
                        <a href="https://twitter.com/knyttneve" class="text-brandPink ml-1" rel="noopener noreferrer" target="_blank">@Iremceyizevi</a>
                    </p>


                </nav>
                <nav class="text-sm text-brandPink sm:ml-4 sm:pl-4  sm:py-2 sm:mt-0 mt-4">
                    <h6 className="footer-title">Politikalar</h6>
                    <Link className='hover:scale-105 transition-transform' to={'useragreement'} >Kullanıcı Sözleşmesi</Link>
                    <Link className='hover:scale-105 transition-transform' to={'privacypolicy'} >Gizlilik Politikası</Link>
                    <Link className='hover:scale-105 transition-transform' to={'cookiepolicy '} >Çerez Politikası</Link>


                </nav>
            </div>
        </footer>
    )
}
