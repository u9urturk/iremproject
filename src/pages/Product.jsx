import React, { useEffect, useState } from 'react'

import {  useParams } from 'react-router-dom'
import { downloadImages, getCategoryByCategoryId, getProductByProductId, getStoragebase } from '../firebase'
import { Carousel, IconButton } from '@material-tailwind/react';
import { getDownloadURL, ref } from 'firebase/storage';

export default function Product() {
    const productId = useParams();
    const [product, setProduct] = useState();
    const [images, setImages] = useState([]);


    const productReaction = () => {
        getProductByProductId(productId.productId).then(res => {
            getCategoryByCategoryId(res.categoryId).then((cRes) => {
                let data = {
                    productId: productId.productId,
                    categoryName: cRes.categoryName,
                    ...res
                }
                setProduct(data);


            });
        })


    }


    const imageReaction = () => {
        downloadImages(productId.productId).then(res => {


            res.forEach(element => {
                getDownloadURL(ref(getStoragebase(), element.fullPath))
                    .then((path) => {
                        setImages(prevState => [...prevState, path])
                    })
            });


        })



    }



    useEffect(() => {
        imageReaction();

        productReaction();


    }, [productId])




    return (
        !product ? <div className='bg-transparent w-full h-screen'></div> :
            <div className='pt-10 w-full animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards  flex items-center justify-center' >
                <div className=' flex flex-row items-start justify-between max-w-[calc(90%)] h-auto rounded-[3rem] w-full bg-gray-100'>
                    <div className=' w-1/4 -translate-y-8  h-screen -translate-x-8'>
                        <div className='  bg-brandGreen max-w-xs w-56  h-[80%]  rounded-[3rem]'>
                            <div className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                                {product.productName}
                            </div>


                        </div>
                    </div>
                    <div className='flex  h-auto  flex-col items-center  w-3/4 justify-center'>
                        <div className="slider-container w-full">
                            <Carousel
                                className="rounded-xl w-full h-1/2"
                                prevArrow={({ handlePrev }) => (
                                    <IconButton
                                        variant="text"
                                        color="white"
                                        size="lg"
                                        onClick={handlePrev}
                                        className="!absolute top-2/4 left-4 -translate-y-2/4"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                            />
                                        </svg>
                                    </IconButton>
                                )}
                                nextArrow={({ handleNext }) => (
                                    <IconButton
                                        variant="text"
                                        color="white"
                                        size="lg"
                                        onClick={handleNext}
                                        className="!absolute top-2/4 !right-4 -translate-y-2/4"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </IconButton>
                                )}
                            >
                                {images.length > 0 && images.map((image, key) => {
                                    return <img
                                        src={image}
                                        alt="Slide"
                                        key={key}
                                        className="object-cover  object-center w-full max-h-[15rem] h-full  "
                                    />
                                })}

                            </Carousel>
                        </div>
                    </div>
                </div>

            </div>
    )
}
