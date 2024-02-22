import React, { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router-dom'
import { downloadImages, getCategoryByCategoryId, getProductByProductId, getStoragebase } from '../firebase'
import { Carousel, IconButton } from '@material-tailwind/react';
import { getDownloadURL, ref } from 'firebase/storage';
import classNames from 'classnames';
import { useModal } from '../Context/ModalContext';

export default function Product() {
    const productId = useParams();
    const [product, setProduct] = useState();
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(null);
    const modalRef = useRef();


    const { isAnyModalOpen, openModal, closeModal } = useModal();

    useEffect(() => {
        if (fullImage != null && fullImage != false) {
            openModal()
        } else {
            closeModal()
        }

        return () => {
            closeModal()
        }
    }, [fullImage])

    const toggleModal = () => {
        setFullImage(false);
    };

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            toggleModal();
        }
    };


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
            <div className={classNames({
                'pt-10 w-full  flex items-center justify-center': true,
                'animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards ': fullImage == null
            })} >
                <div className=' flex flex-row items-start justify-between max-w-[calc(90%)] h-auto rounded-[3rem] w-full bg-gray-100'>
                    <div className=' w-1/4 -translate-y-8  h-screen -translate-x-8'>
                        <div className='  bg-brandGreen max-w-xs w-56  h-[80%]  rounded-[3rem]'>
                            <div className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                                {product.productName}
                            </div>
                            <div className='px-8 py-4  flex items-center justify-center gap-x-2'>
                                <ul className='flex flex-col items-start text-gray-100 justify-center text-left gap-y-3'>
                                    <li> 45 cm x 45 cm</li>
                                    <li> El işi nakış detayları</li>
                                    <li> Beyaz, gri, mavi, bej</li>
                                </ul>
                            </div>
                            <div className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                                {product.price} ₺
                            </div>


                        </div>
                    </div>
                    <div className='flex -translate-y-8 h-auto  flex-col items-center  w-3/4 justify-center'>
                        <div className="slider-container w-full">
                            <Carousel
                                className=" rounded-[3rem] w-full h-1/2"
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
                                        onClick={() => { setFullImage(image) }}
                                        src={image}
                                        alt="Slide"
                                        key={key}
                                        className="object-cover cursor-pointer  object-center w-full max-h-[15rem] h-full  "
                                    />
                                })}

                            </Carousel>
                        </div>
                        <div className='font-serif text-gray-600 px-16 pt-8 '>
                            Bu şık ve zarif işlemeli yastık, evinize sofistike bir dokunuş katacak. Yüksek kaliteli malzemelerden üretilmiş olan yastığımız, zarafeti ve dayanıklılığı bir araya getiriyor. İnce işçilikle işlenmiş desenler, her detayda özenin görüldüğünü hissettiriyor.

                            Yastığımızın yumuşak dolumu, size konforlu bir dinlenme deneyimi sunarken, odanızın dekorasyonuna da zarif bir katkı sağlar. İşlemeli detaylar, yastığımızı sıradanlıktan çıkarırken, çeşitli renk seçenekleriyle de mekânınıza uyum sağlar.

                            Bu işlemeli dekoratif yastık, oturma odası koltuklarınıza, yatak odası dekorunuza veya herhangi bir oturma alanına sofistike bir dokunuş eklemek için mükemmel bir seçenektir. Yüksek kaliteli malzemelerle tasarlanmış olması, uzun ömürlü ve kullanışlı bir ürün sunar.

                           
                            Ev dekorasyonunuzu tamamlamak ve stilinizi yansıtmak için bu işlemeli dekoratif yastığı bugün sepetinize ekleyin!
                        </div>
                    </div>
                </div>


                {fullImage != null && fullImage != false &&
                    <div className='fixed top-0 left-0 z-40 h-screen w-screen backdrop-blur-sm '>
                        <div onClick={handleCloseModal} ref={modalRef} className='flex items-center justify-center   relative   w-full h-full bg-transparent '>
                            <img src={fullImage} alt="" className=' object-cover animate-fade    object-center w-auto  max-h-screen h-[calc(100%-2rem)] ' />


                        </div>
                    </div>}



            </div>



    )
}
