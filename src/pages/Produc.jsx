import { Avatar, Carousel, IconButton, Rating, Typography } from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react'
import { IoIosClose } from 'react-icons/io';
import { Link, useParams } from 'react-router-dom';
import ListenImages from '../components/ListenImages';
import classNames from 'classnames';
import { useModal } from '../Context/ModalContext';
import { downloadImages, getCategoryByCategoryId, getProductByCategoryId, getProductByProductId, getStoragebase } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { HiOutlineColorSwatch } from 'react-icons/hi';
import { GiRolledCloth } from 'react-icons/gi';
import { MdOutlinePattern } from 'react-icons/md';

export default function Produc() {
    const productId = useParams();
    const [product, setProduct] = useState();
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(null);
    const modalRef = useRef();
    const [rated, setRated] = useState(4);
    const [categoryId, setCategoryId] = useState("");
    const [products, setProducts] = useState([]);


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
            setCategoryId(res.categoryId);
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

    const productByCategoryIdReaction = () => {
        getProductByCategoryId(categoryId).then((res) => {
            res.forEach(async (doc) => {
                await getCategoryByCategoryId(doc.data().categoryId).then((res) => {
                    let data = {
                        productId: doc.id,
                        categoryName: res.categoryName,
                        ...doc.data()
                    }


                    setProducts(prevState => [...prevState, data])
                });

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

    useEffect(() => {
        productByCategoryIdReaction();
    
    }, [categoryId])
    return (
        !product ? <div className='bg-transparent w-full h-screen'></div> :
            <div className={classNames({
                'pt-10 w-full gap-y-24 flex flex-col items-center justify-center': true,
                'animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards ': fullImage == null
            })} >
                <div className=' flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between max-w-[calc(90%)] h-auto rounded-[3rem] w-full bg-gray-100'>
                    <div className=' md:w-1/4 -translate-y-12 md:-translate-y-8  max-h-screen h-auto md:-translate-x-8'>
                        <div className='  bg-brandGreen flex  flex-col justify-between py-8 items-center w-auto  md:max-w-xs md:w-56 h-auto  md:h-[80%]  rounded-[3rem]'>

                            <Typography variant='h1' className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                                {product.productName}
                            </Typography>
                            <div className='flex flex-col gap-y-2 items-center justify-center w-full '>
                                <div className='text-sm font-semibold text-white opacity-95'>Müşteri Derecelendirmeleri</div>
                                <div className='flex items-center justify-center gap-x-2 text-white text-opacity-90 font-semibold'>{rated}<Rating value={4} readonly onChange={(value) => setRated(value)} /></div>
                                <div className='flex items-center justify-center text-xs text-white opacity-60 '>134 Yoruma Dayalı</div>
                            </div>
                            <div className='px-8 py-4 w-full flex items-center justify-center gap-x-2'>
                                <ul className='flex gap-x-6  md:gap-x-0 md:flex-col w-full  items-start text-gray-100 justify-center text-left gap-y-3'>
                                    <li data-tip="Renkler" className='flex w-full tooltip place-items-center items-center gap-x-4 hover:scale-110 cursor-pointer transition-all'><HiOutlineColorSwatch size={30} /> Kırmızı</li>
                                    <li data-tip="Kumaşlar" className='flex w-full tooltip place-items-center items-center gap-x-4 hover:scale-110 cursor-pointer transition-all'><GiRolledCloth size={30} /> Polyester</li>
                                    <li data-tip="Desenler" className='flex w-full tooltip place-items-center  items-center gap-x-4 hover:scale-110 cursor-pointer transition-all'><MdOutlinePattern size={30} /></li>
                                </ul>
                            </div>
                            <div className='px-8 py-4 text-4xl text-white font-semibold flex items-center justify-center gap-x-2'>
                                {product.price} ₺
                            </div>
                            <button className='px-4 py-2 text-xl border-2 hover:scale-105 transition-all bg-primary border-gray-100 rounded-2xl text-white font-semibold flex items-center justify-center gap-x-2'>
                                İletişime Geç
                            </button>


                        </div>
                    </div>
                    <div className='flex md:-translate-y-8 h-auto  flex-col items-center  w-3/4 justify-center'>
                        <div className="slider-container w-full">
                            <Carousel
                                className=" rounded-[3rem] w-full md:h-1/2"
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
                                        className="object-cover cursor-pointer  object-center  w-full max-h-[15rem] h-auto  "
                                    />
                                })}

                            </Carousel>
                        </div>
                        <Typography variant='paragraph' className='font-serif text-gray-600 md:px-16 pt-8 '>
                            Bu şık ve zarif işlemeli yastık, evinize sofistike bir dokunuş katacak. Yüksek kaliteli malzemelerden üretilmiş olan yastığımız, zarafeti ve dayanıklılığı bir araya getiriyor. İnce işçilikle işlenmiş desenler, her detayda özenin görüldüğünü hissettiriyor.

                            Yastığımızın yumuşak dolumu, size konforlu bir dinlenme deneyimi sunarken, odanızın dekorasyonuna da zarif bir katkı sağlar. İşlemeli detaylar, yastığımızı sıradanlıktan çıkarırken, çeşitli renk seçenekleriyle de mekânınıza uyum sağlar.

                            Bu işlemeli dekoratif yastık, oturma odası koltuklarınıza, yatak odası dekorunuza veya herhangi bir oturma alanına sofistike bir dokunuş eklemek için mükemmel bir seçenektir. Yüksek kaliteli malzemelerle tasarlanmış olması, uzun ömürlü ve kullanışlı bir ürün sunar.


                            Ev dekorasyonunuzu tamamlamak ve stilinizi yansıtmak için bu işlemeli dekoratif yastığı bugün sepetinize ekleyin!
                        </Typography>
                    </div>
                </div>
                <div className=' flex flex-col h-auto max-h-[600px] gap-y-8 items-center px-8 justify-start max-w-[calc(90%)] rounded-[3rem] w-full bg-gray-100'>
                    <Typography variant='h3' className='pt-8 w-full flex items-center justify-center text-center' >Benzer Ürünler</Typography>
                    <div className='grid grid-cols-1 place-items-center md:grid-cols-4 gap-y-6  w-full h-[500px]  gap-x-6 overflow-auto '>
                        {
                            products.length > 0 && products.map((product, key) => {

                                return <Link to={`product/${product.productId}`} key={key} className="card w-60 md:w-52 transition-all shadow-lg hover:shadow-2xl h-auto cursor-pointer group">

                                    <figure ><ListenImages productId={product.productId}></ListenImages></figure>
                                    <div className="card-body     ">
                                        <h2 className="card-title text-md">{product.productName}</h2>
                                        <h4 className='font-serif  opacity-60'>{product.categoryName}</h4>
                                        <div className="card-actions relative pt-1 md:pt-2 flex md:flex-col items-center  justify-center">

                                            <div className='w-full h-auto'><div className=" badge  text-xs  md:text-md badge-secondary badge-lg badge-outline">{product.price} &#x20BA;</div></div>
                                            <button className=" opacity-100 bg-brandGreen font-sans font-semibold text-gray-100 shadow-2xl transition-all mt-2 rounded-3xl py-2 px-2  w-full  text-xs md:text-md ">Ürünü İncele</button>
                                        </div>


                                    </div>
                                </Link>
                            })
                        }
                    </div>
                </div>
                <div className=' flex flex-col h-auto overflow-auto max-h-[600px] gap-y-8 items-center px-8 justify-start max-w-[calc(90%)] rounded-[3rem] w-full bg-gray-100'>
                    <Typography variant='h3' className='pt-8 w-full flex items-center justify-center text-center' >Müşterilerimizin Görüşleri</Typography>
                    <Typography variant='paragraph' className=' w-[80%] text-sm text-center opacity-60'>If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).</Typography>
                    <div className='flex w-full max-w-[95%] items-start justify-start flex-col gap-y-4 '>
                        <div className='flex items-start justify-center'><Rating value={4} readonly /></div>
                        <div className='flex items-start justify-center'><Typography variant='small'>If everything I did failed - which it doesn't, it actually succeeds - just the fact that I'm willing to fail is an inspiration. People are so scared to lose that they don't even try. Like, one thing people can't say is that I'm not trying, and I'm not trying my hardest, and I'm not trying to do the best way I know how.</Typography></div>
                        <div className='flex flex-row gap-x-2  pt-2 items-start justify-center'>
                            <div><Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" /></div>
                            <div className='flex flex-col items-start justify-start '>
                                <Typography variant='lead'>Ryan Samuel</Typography>
                                <div className='opacity-40'>03 March 2023</div>
                            </div>
                        </div>
                        <div className="divider w-[40%]"></div>
                    </div>
                    <div className='flex w-full max-w-[95%] items-start justify-start flex-col gap-y-4 '>
                        <div className='flex items-start justify-center'><Rating value={4} readonly /></div>
                        <div className='flex items-start justify-center'><Typography variant='small'>If everything I did failed - which it doesn't, it actually succeeds - just the fact that I'm willing to fail is an inspiration. People are so scared to lose that they don't even try. Like, one thing people can't say is that I'm not trying, and I'm not trying my hardest, and I'm not trying to do the best way I know how.</Typography></div>
                        <div className='flex flex-row gap-x-2  pt-2 items-start justify-center'>
                            <div><Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" /></div>
                            <div className='flex flex-col items-start justify-start '>
                                <Typography variant='lead'>Ryan Samuel</Typography>
                                <div className='opacity-40'>03 March 2023</div>
                            </div>
                        </div>
                        <div className="divider w-[40%]"></div>
                    </div>
                    <div className='flex w-full max-w-[95%] items-start justify-start flex-col gap-y-4 '>
                        <div className='flex items-start justify-center'><Rating value={4} readonly /></div>
                        <div className='flex items-start justify-center'><Typography variant='small'>If everything I did failed - which it doesn't, it actually succeeds - just the fact that I'm willing to fail is an inspiration. People are so scared to lose that they don't even try. Like, one thing people can't say is that I'm not trying, and I'm not trying my hardest, and I'm not trying to do the best way I know how.</Typography></div>
                        <div className='flex flex-row gap-x-2  pt-2 items-start justify-center'>
                            <div><Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" /></div>
                            <div className='flex flex-col items-start justify-start '>
                                <Typography variant='lead'>Ryan Samuel</Typography>
                                <div className='opacity-40'>03 March 2023</div>
                            </div>
                        </div>
                        <div className="divider w-[40%]"></div>
                    </div> <div className='flex w-full max-w-[95%] items-start justify-start flex-col gap-y-4 '>
                        <div className='flex items-start justify-center'><Rating value={4} readonly /></div>
                        <div className='flex items-start justify-center'><Typography variant='small'>If everything I did failed - which it doesn't, it actually succeeds - just the fact that I'm willing to fail is an inspiration. People are so scared to lose that they don't even try. Like, one thing people can't say is that I'm not trying, and I'm not trying my hardest, and I'm not trying to do the best way I know how.</Typography></div>
                        <div className='flex flex-row gap-x-2  pt-2 items-start justify-center'>
                            <div><Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" /></div>
                            <div className='flex flex-col items-start justify-start '>
                                <Typography variant='lead'>Ryan Samuel</Typography>
                                <div className='opacity-40'>03 March 2023</div>
                            </div>
                        </div>
                        <div className="divider w-[40%]"></div>
                    </div> <div className='flex w-full max-w-[95%] items-start justify-start flex-col gap-y-4 '>
                        <div className='flex items-start justify-center'><Rating value={4} readonly /></div>
                        <div className='flex items-start justify-center'><Typography variant='small'>If everything I did failed - which it doesn't, it actually succeeds - just the fact that I'm willing to fail is an inspiration. People are so scared to lose that they don't even try. Like, one thing people can't say is that I'm not trying, and I'm not trying my hardest, and I'm not trying to do the best way I know how.</Typography></div>
                        <div className='flex flex-row gap-x-2  pt-2 items-start justify-center'>
                            <div><Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" /></div>
                            <div className='flex flex-col items-start justify-start '>
                                <Typography variant='lead'>Ryan Samuel</Typography>
                                <div className='opacity-40'>03 March 2023</div>
                            </div>
                        </div>
                        <div className="divider w-[40%]"></div>
                    </div> <div className='flex w-full max-w-[95%] items-start justify-start flex-col gap-y-4 '>
                        <div className='flex items-start justify-center'><Rating value={4} readonly /></div>
                        <div className='flex items-start justify-center'><Typography variant='small'>If everything I did failed - which it doesn't, it actually succeeds - just the fact that I'm willing to fail is an inspiration. People are so scared to lose that they don't even try. Like, one thing people can't say is that I'm not trying, and I'm not trying my hardest, and I'm not trying to do the best way I know how.</Typography></div>
                        <div className='flex flex-row gap-x-2  pt-2 items-start justify-center'>
                            <div><Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" /></div>
                            <div className='flex flex-col items-start justify-start '>
                                <Typography variant='lead'>Ryan Samuel</Typography>
                                <div className='opacity-40'>03 March 2023</div>
                            </div>
                        </div>
                        <div className="divider w-[40%]"></div>
                    </div>


                </div>


                {fullImage != null && fullImage != false &&
                    <div className='fixed top-0 left-0 z-50 h-screen w-screen backdrop-blur-sm '>
                        <div onClick={handleCloseModal} ref={modalRef} className='flex items-center justify-center      w-full h-full bg-transparent '>
                            <div className='w-auto  animate-fade  h-auto relative'>
                                <img src={fullImage} alt="" className=' object-cover   object-center w-auto  h-auto max-h-screen  ' />
                                <button onClick={toggleModal} className='absolute right-8 top-8'><IoIosClose size={38} /></button>
                            </div>


                        </div>
                    </div>}



            </div>
    )
}
