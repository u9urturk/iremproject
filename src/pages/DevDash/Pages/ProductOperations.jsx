import React, { useState } from 'react'
import ProductAdd from '../../../components/ProductAdd'
import Products from '../Data/Products'

export default function ProductOperations() {
    const [productChanged, setProductChanged] = useState();
  
    const handleProductStateChange=(data)=>{
        setProductChanged(data);
    }

  return (
    <div className='flex animate-fade-down animate-ease-in-out animate-normal animate-fill-forwards w-full h-full flex-col items-center justify-center'>
            <div className='flex flex-col w-full h-1/2 gap-y-8 items-center justify-center'>
                <div className='flex w-full  items-start justify-between '>
                    <h1 className='text-2xl font-semibold'>
                        Ürün İşlemleri
                    </h1>
                    <ProductAdd productStateChange={handleProductStateChange}></ProductAdd>
                </div>
                <div className='w-full'>
                    <div className="stats shadow flex flex-col gap-y-8 md:gap-y-0 md:flex-row">

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="stat-title">Ürün Sayısı</div>
                            <div className="stat-value">31K</div>
                            <div className="stat-desc">Jan 1st - Feb 1st</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <div className="stat-title">En Çok İncelenen Ürün</div>
                            <div className="stat-value">4,200</div>
                            <div className="stat-desc">↗︎ 400 (22%)</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">En Az İncelenen Ürün</div>
                            <div className="stat-value">1,200</div>
                            <div className="stat-desc">↘︎ 90 (14%)</div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='h-1/2 w-full flex flex-col gap-y-2 items-start'>
                <h1 className='text-2xl font-semibold '>
                    Kategoriler
                </h1>
                <Products productChanged={productChanged}></Products>

            </div>
        </div>
  )
}
