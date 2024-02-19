import React, { Fragment, useEffect, useState } from 'react'
import { getCategories, getCategoryByCategoryId, getProductByCategoryId, getProducts } from '../firebase'
import ListenImages from '../components/ListenImages'
import { Link } from 'react-router-dom'
import { Listbox, Transition } from '@headlessui/react';
import { PiCaretUpDownLight } from 'react-icons/pi';
import { BsCheck } from 'react-icons/bs';
import "..//ScrollStyle.css"

export default function Products() {
    const getProductsBase = getProducts();
    const [products, setProducts] = useState([])
    const getCategoriesBase = getCategories();
    const [categories, setCategories] = useState([])
    const [selected, setSelected] = useState({
        categoryName: "Kategoriler"
    })

    const categoryReaction = () => {
        getCategoriesBase.then(res => {
            res.forEach((doc) => {
                let data = { categoryId: doc.id, ...doc.data() }
                // console.log(doc.data())
                setCategories(prevState => [...prevState, data])
            })
        })
    }



    const productReaction = () => {
        setProducts("");
        getProductsBase.then(res => {
            res.forEach(async (doc) => {
                await getCategoryByCategoryId(doc.data().categoryId).then((res) => {
                    let data = {
                        productId: doc.id,
                        categoryName: res.categoryName,
                        ...doc.data()
                    }
                    setProducts(prevState => [...prevState, data])

                });


            })
        })
    }


    const productByCategoryIdReaction = (categoryId) => {
        setProducts("");
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

    useEffect(() => {
        categoryReaction()
        productReaction()
    }, [])


    const loadingPage = () => {
        const set = []
        let range = 9;
        for (let i = 0; i < range; i++) {
            set.push({
                res: <div className="flex flex-col gap-4 w-52">
                    <div className="skeleton h-32 w-full"></div>
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </div>
            })

        }
        return set;
    }



    return (
        <div class="container mx-auto  flex flex-col items-center justify-center gap-y-16   ">
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>
                <div className='flex flex-col  gap-y-2 items-center justify-center'>
                    {categories.length == 0 && <div className='py-1 px-2'>Yükleniyor ...</div>}


                    {categories.length > 0 && <div className='grid grid-cols-4 md:grid-cols-8 gap-y-4   place-content-center gap-x-2 text-brandWhite'>
                        <div onClick={() => { productReaction() }} className='flex flex-col w-auto items-center justify-center gap-y-2'>

                            <div onClick={()=>{setSelected({categoryName:"Kategoriler"})}} className='btn w-auto  btn-sm sm:btn-sm md:btn-md '>
                                Tüm Ürünler
                            </div>

                        </div>


                        <Listbox value={selected} onChange={setSelected}>
                            <div className="relative ">
                                <Listbox.Button className="relative w-full btn   btn-sm sm:btn-sm md:btn-md cursor-default  text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                    <span className="block truncate">{selected.categoryName}</span>

                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 z-[1] max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {categories.map((data, key) => (
                                            <Listbox.Option
                                                onClick={() => { productByCategoryIdReaction(data.categoryId) }}
                                                key={key}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                    }`
                                                }
                                                value={data}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                        >
                                                            {data.categoryName}
                                                        </span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                <BsCheck className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>

                        <div onClick={()=>{setSelected({categoryName:"Kategoriler"})}} className='btn w-auto  btn-sm sm:btn-sm md:btn-md '>
                                Renkler
                            </div>

                            <div onClick={()=>{setSelected({categoryName:"Kategoriler"})}} className='btn w-auto  btn-sm sm:btn-sm md:btn-md '>
                                Desenler
                            </div>


                      


                    </div>}
                </div>
            </div>
            <div className='flex items-center justify-center '>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:gird-cols-5 gap-y-16 md:gap-x-12 md:gap-y-24'>
                    {products.length == 0 && loadingPage().map(res => {
                        return res.res
                    })}
                    {
                        products.length > 0 && products.map((product, key) => {

                            return <Link to={`product/${product.productId}`} key={key} className="card w-60 md:w-52   hover:scale-110 transition-all shadow-2xl hover:shadow-lg h-auto cursor-pointer group">

                                <figure ><ListenImages productId={product.productId}></ListenImages></figure>
                                <div className="card-body  ">
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
        </div>
    )
}
