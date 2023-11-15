import React from 'react'

export default function Product() {
    return (
        <div className='flex flex-col  items-center justify-center'>
            <div className='container bg-base-200 bg-opacity-25 flex items-center justify-center gap-x-2'>
                <div className='w-full bg-white'>
                    <div className='h-96 w-full flex items-center justify-center  '>Görseller</div>
                    <div className=' flex items-center justify-center'>görseller ön izleme </div>
                </div>
                <div className='h-96 w-full flex flex-col items-center justify-center gap-y-20 '>
                    <div className='flex items-center justify-center w-full h-auto'>Ürün ismi</div>
                    <div className='flex items-center justify-around w-full h-auto'>
                        <div>fiyat</div>
                        <div>yıldız</div>
                    </div>
                    <div className='flex items-center justify-center w-full h-auto'>seçenekler</div>
                    <div className='flex items-center justify-around w-full h-auto'>
                        <button>Beğen</button>
                        <button>Listeye Ekle</button>
                    </div>
                </div>
            </div>

            <div className='container h-96 bg-base-200 bg-opacity-25 flex items-center justify-center gap-x-2'>
               Benzer Ürünler
            </div>

            <div className='container h-96 bg-base-200 bg-opacity-25 flex items-center justify-center gap-x-2'>
               Değerlendirmeler
            </div>
        </div>
    )
}
