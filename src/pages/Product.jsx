import React from 'react'

export default function Product() {
    return (
        <div className='flex flex-col font-semibold items-center justify-center'>
            <div className='container bg-base-200 bg-opacity-25 flex items-center justify-center gap-x-2'>
                <div className='w-full bg-white'>
                    <div className='h-96 w-full flex items-center justify-center  '>
                        <img className='w-full h-full' src="https://firebasestorage.googleapis.com/v0/b/iremceyizevi-6265d.appspot.com/o/V8bOBb5zUwuteCFFyx97%2F1.jpg?alt=media&token=340d817c-4754-448a-895d-8fdea30d1573" alt="" />
                    </div>
                    <div className=' flex h-16 items-center justify-center'>görseller ön izleme </div>
                </div>
                <div className='h-96 w-full flex flex-col items-center justify-center gap-y-20 '>
                    <div className='flex items-center justify-center w-full h-auto'>Yıldız Desenli Havlu</div>
                    <div className='flex items-center justify-around w-full h-auto'>
                        <div className='flex font-semibold text-brandGreen items-center justify-center gap-x-2'>
                            <div>235,00</div>
                            <div className='flex items-end justify-center text-xs'>TL</div>
                        </div>
                        <div className='filex items-center justify-center'>
                            <div className="rating">
                                <input type="radio" name="rating-1" className="mask mask-star" />
                                <input type="radio" name="rating-1" className="mask mask-star" checked />
                                <input type="radio" name="rating-1" className="mask mask-star" />
                                <input type="radio" name="rating-1" className="mask mask-star" />
                                <input type="radio" name="rating-1" className="mask mask-star" />
                            </div>
                        </div>
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
