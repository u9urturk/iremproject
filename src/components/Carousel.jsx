import React, { useCallback, useEffect, useState } from 'react'
import { downloadImages } from '../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { BiArrowBack } from "react-icons/bi";


export default function Carousel(productId) {
    const storage = getStorage();
    const [data, setData] = useState([])
    const [currentImage, setCurrentImage] = useState(null);
    const listen = useCallback(
        () => {
            downloadImages('productImages', productId.productId).then(res => {

                res.forEach(e => {
                    getDownloadURL(ref(storage, e.fullPath))
                        .then((path) => {
                            setData(prevItems => [...prevItems, path])
                        })
                });


            })
        },
        [productId, storage]
    )

    useEffect(() => {
        listen()
    }, [productId, listen])


    return (
        <div className='w-full flex items-center justify-center h-auto'>
            <div className="carousel carousel-center space-x-4 max-w-md mx-4 ">
                {
                    data.length === 0 ? <span className="loading loading-dots loading-lg"></span>
                        : data.map((image, key) => {
                            return <div key={key} onClick={() => { setCurrentImage(image); document.getElementById('my_modal_4').showModal() }} className="carousel-item">
                                <img
                                    alt={key}
                                    src={image}
                                    className="rounded-box h-96 w-64" />
                            </div>
                        })
                }




            </div>
            <dialog id="my_modal_4" className="modal w-full h-auto fixed left-0 top-0">
                <div className='relative w-full h-auto flex items-center justify-center '>
                    <img
                        alt={"CurrentImage"}
                        src={currentImage}
                        className="w-[95%] h-screen  object-contain" />

                </div>
                <div onClick={() => { document.getElementById("my_modal_4").close() }}
                    className='absolute bottom-10 md:top-5 md:bottom-0 right-5 transition-transform cursor-pointer text-gray-100'>
                    <BiArrowBack />
                </div>
            </dialog>
        </div>
    )
}
