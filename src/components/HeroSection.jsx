import React, { useEffect, useState } from 'react'
import { useScroll } from '../context/ScrollContext';
import useProgressiveValue from '../customHook/useProgressiveValue';

export default function HeroSection() {
    const { scrollTo } = useScroll();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const stepCount = 4; // toplam adım sayısı
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % stepCount); // sıradaki stepe geç
        }, 2000); // 2000ms, yani 2 saniyede bir geçiş

        return () => clearInterval(interval); // bileşen unmount olduğunda interval'i temizle
    }, []);

 
    

    return (
        <div className='w-full animate-fade-right gap-y-4 md:animate-fade flex flex-col md:flex-row items-center justify-between md:py-16  h-auto '>
            <div className='md:w-[50%] px-2'>
                <strong className='font-bold text-4xl md:text-6xl md:pr-8'>Mutluluğa Giden Yolda, Hayalinizdeki Çeyizle Tanışın</strong>
                <p className='pt-4 opacity-60 font-medium'>Evinize sıcaklık, her anınıza değer katacak ürünler.

                    En güzel başlangıçlar için en özel seçimler burada!</p>
                <button onClick={() => scrollTo("section1")} className='mt-4 btn bg-brandGreen text-gray-100  flex items-center justify-center rounded-none'>Ürünleri İncele</button>
            </div>
            <div className='md:w-[30%] flex items-center justify-center'>
                <div className="stats flex flex-row md:flex-col m-2 shadow">
                    <div className="stat place-items-center">
                        <div className="stat-title">Ürünler</div>
                        <div className="stat-value">{useProgressiveValue(0,81,2000)}+</div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Desenler</div>
                        <div className="stat-value text-secondary">{useProgressiveValue(0,42,2000)}+</div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Deneyim</div>
                        <div className="stat-value">{useProgressiveValue(0,15,2000)}+Yıl</div>
                    </div>
                </div>
            </div>
            <div className='md:w-[20%] flex items-center justify-center'>
                <ul className="steps steps-horizontal  md:steps-vertical mb-8">
                    {["Ürünleri incele", "Siparişini oluştur", "İletişime Geç", "Hazırlıklar Başlasın"].map((step, index) => (
                        <li
                            key={index}
                            className={`step ${index <= activeStep ? 'step-primary' : ''} transition-all duration-1000`}
                        >
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
