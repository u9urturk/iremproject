import React from 'react'
import baseUrl from '../asset/b.png'
import { useScroll } from '../context/ScrollContext';

export default function HeroSection() {
    const { scrollTo } = useScroll();

   
    return (
        <div className='w-full animate-fade-right gap-y-4 md:animate-fade flex flex-col md:flex-row items-center justify-between md:py-16  h-auto '>
            <div className='md:w-[50%] px-2'>
                <strong className='font-bold text-4xl md:text-6xl md:pr-8'>Mutluluğa Giden Yolda, Hayalinizdeki Çeyizle Tanışın</strong>
                <p className='pt-4 opacity-60 font-medium'>Evinize sıcaklık, her anınıza değer katacak ürünler.

                    En güzel başlangıçlar için en özel seçimler burada!</p>
                <button onClick={() => scrollTo("section1")} className='mt-4 btn btn-primary text-gray-100  flex items-center justify-center rounded-none'>Ürünleri İncele</button>
            </div>
            <div className='md:w-[35%]'>
                <img className='h-96' src={baseUrl} alt="" />
            </div>
            <div className='md:w-[15%]'>
                <ul className="steps steps-horizontal md:steps-vertical mb-8">
                    <li className="step step-primary">Register</li>
                    <li className="step step-primary">Choose plan</li>
                    <li className="step">Purchase</li>
                    <li className="step">Receive Product</li>
                </ul>
            </div>
        </div>
    )
}
