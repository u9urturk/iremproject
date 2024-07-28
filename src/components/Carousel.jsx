import React, { useEffect, useState } from 'react'
import { downloadImages } from '../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function Carousel(productId) {
    const storage = getStorage();
    const [data, setData] = useState([])
    const listen = () => {

        downloadImages('productImages',productId.productId).then(res => {

            res.forEach(e => {
                getDownloadURL(ref(storage, e.fullPath))
                    .then((path) => {
                        setData(prevItems => [...prevItems, path])
                    })
            });


        })

    }

    useEffect(() => {
        listen()
    }, [productId])
    return (
        <div className='flex items-center justify-center'>
            {data.length === 0 ? <span className="loading loading-dots loading-lg"></span>
                : <div id='carousel' className="carousel translate-y-2 carousel-center bg-neutral  md:carousel-vertical rounded-box w-auto h-72">

                    {data.map((image, key) => {
                        return <div key={key} className="carousel-item">
                            <img
                                src={image}
                                className="rounded-box w-[348px] h-72" />
                        </div>
                    })}


                </div>}
        </div>
    )
}
