import React, { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'
import { downloadImages, getCategoryByCategoryId, getProductByProductId } from '../firebase'
import { Carousel, IconButton, Slider } from '@material-tailwind/react';

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
            res.map(image=>{
                let data = {
                   url:image
                }
                setImages(prevState => [...prevState, data])
            })


        })



    }

    console.log(images)


    useEffect(() => {
        productReaction();
        imageReaction();


    }, [productId])





    return (
        !product ? <div className='bg-transparent w-full h-screen'></div> : <div className='pt-10 w-full animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards  h-auto flex items-center justify-center' >
            <div className=' flex flex-row items-start justify-between max-w-[calc(90%)] h-screen rounded-[3rem] w-full bg-gray-100'>
                <div className='relative w-1/4'>
                    <div className='absolute -left-8 -top-8 bg-brandGreen max-w-xs w-auto h-screen rounded-[3rem]'>
                        <div className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                            {product.productName}
                        </div>
                        <ul className="menu bg-transparent flex items-start justify-center text-white w-56 rounded-box">
                            <li><Link to={"kategoriislemleri"}>Kategori İşlemleri</Link></li>
                            <li><Link to={"ozellikislemleri"} >Özellik İşlemleri</Link></li>
                            <li><Link to={"urunislemleri"} >Ürün İşlemleri</Link></li>
                            <li><Link to={"kullaniciislemleri"} >Kullanıcı İşlemleri</Link></li>
                        </ul>

                    </div>
                </div>
                <div className='h-full  pr-8 flex items-center justify-center w-3/4'>
                    <div className='flex w-full  h-20  flex-col items-center justify-center'>
                        <div className="slider-container">
                            <Carousel
                                className="rounded-xl h-1/2"
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
                                {images.length>0 && images.map((image, key) => {
                                    return <img
                                        src={image}
                                        alt="Slide"
                                        key={key}
                                        className="object-cover  object-center w-full max-h-[35rem] h-full  "
                                    />
                                })}

                            </Carousel>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
