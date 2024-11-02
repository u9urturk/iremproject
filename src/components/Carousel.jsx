import React, { useCallback, useEffect, useState } from 'react'
import { downloadImages } from '../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

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

    console.log(data)

    return (
        <div className='w-full flex items-center justify-center h-auto'>
            <div className="carousel carousel-center  max-w-md px-4 mx-4 ">
                {
                    data.length === 0 ? <span className="loading loading-dots loading-lg"></span>
                        : data.map((image, key) => {
                            return <div key={key} onClick={() => { setCurrentImage(image); document.getElementById('my_modal_4').showModal() }} className="carousel-item">
                                <img
                                    alt={key}
                                    src={image}
                                    className="rounded-box h-96 w-96" />
                            </div>
                        })
                }


                <dialog id="my_modal_4" className="modal w-full h-auto fixed left-0 top-0">
                    <div className='relative w-full h-auto flex items-center justify-center '>
                        <img
                            alt={"CurrentImage"}
                            src={currentImage}
                            className="w-[90%] h-screen  object-contain" />

                    </div>
                    <div className='absolute top-5 right-5 cursor-pointer text-gray-100'>X</div>
                </dialog>

            </div>
        </div>
    )
    // return (
    //     <div className='flex items-center justify-center'>
    //         {data.length === 0 ? <span className="loading loading-dots loading-lg"></span>
    //             : <div id='carousel' className="carousel translate-y-2 carousel-center bg-neutral  md:carousel-vertical rounded-box w-auto h-72">

    //                 {data.map((image, key) => {
    //                     return <div key={key} onClick={() => { setCurrentImage(image); document.getElementById('my_modal_4').showModal() }} className="carousel-item">
    //                         <img
    //                             alt={key}
    //                             src={image}
    //                             className="rounded-box  w-[348px] h-72 object-cover" />
    //                     </div>
    //                 })}


    //             </div>}

    //         <dialog id="my_modal_4" className="modal w-full h-screen flex items-center justify-center">
    //             <div className=" flex shadow-none items-center justify-center flex-col modal-box w-full max-w-full h-screen p-0 bg-transparent">
    //                 <img
    //                     alt={"CurrentImage"}
    //                     src={currentImage}
    //                     className="w-auto h-auto object-contain" />
    //                 <div className="modal-action flex w-full items-end p-4">
    //                     <form method="dialog ">
    //                         {/* if there is a button, it will close the modal */}
    //                         <button type='button' onClick={() => { document.getElementById('my_modal_4').close() }} 
    //                         className="btn btn-primary">Kapat</button>
    //                     </form>
    //                 </div>
    //             </div>
    //         </dialog>
    //     </div>
    // )
}
