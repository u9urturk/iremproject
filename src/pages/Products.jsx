import React, { useCallback, useEffect, useRef, useState } from 'react'
import ListenImages from '../components/ListenImages'
import { Link } from 'react-router-dom'
import ProductRating from '../components/ProductRaiting';
import { useScroll } from '../context/ScrollContext';
import { getCategories, getCategoryByCategoryId } from '../firebase/categoryService';
import { getProductByCategoryId, getProducts } from '../firebase/productService';

export default function Products({ id }) {

    const ref = useRef(null);
    const { registerRef } = useScroll();

    useEffect(() => {
        registerRef(id, ref.current);
    }, [id, registerRef]);

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [selected, setSelected] = useState()

    const categoryReaction = useCallback(
        () => {
            getCategories().then(res => {
                res.forEach((doc) => {
                    let data = { categoryId: doc.id, ...doc.data() }
                    // console.log(doc.data())
                    setCategories(prevState => [...prevState, data])
                })
            })
        },
        [],
    )



    const productReaction = useCallback(
        () => {
            setProducts("");
            getProducts().then(res => {
                res.products.forEach(async (product) => {
                    await getCategoryByCategoryId(product.categoryId).then((res) => {
                        let data = {
                            productId: product.id,
                            categoryName: res.name,
                            productName: product.productName,
                            basePrice: product.basePrice,
                            rating: Math.round(product.rating)

                        }
                        setProducts(prevState => [...prevState, data])

                    });


                })
            })
        },
        [],
    )



    const productByCategoryIdReaction = (categoryId) => {
        setProducts("");
        getProductByCategoryId(categoryId).then((res) => {
            res.products.forEach(async (product) => {
                await getCategoryByCategoryId(product.categoryId).then((res) => {

                    let data = {
                        productId: product.id,
                        categoryName: res.name,
                        ...product
                    }
                    setProducts(prevState => [...prevState, data])
                });

            });

        })




    }

    useEffect(() => {
        categoryReaction()
        productReaction()
    }, [categoryReaction, productReaction])

    const loadingPage = () => {
        const set = []
        let range = 9;
        for (let i = 0; i < range; i++) {
            set.push({
                res: <div key={`skeleton${i}`} className="flex flex-col gap-4 w-52">
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
        <div ref={ref} className="flex mt-16 flex-col items-center justify-center gap-y-16   ">
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>
                <div className='flex flex-col z-[1]  gap-y-2 items-center justify-center'>
                    {categories.length === 0 && <div className='py-1 px-2'>Yükleniyor ...</div>}


                    {categories.length > 0 && <div className='flex items-center gap-y-2 px-4 justify-start flex-wrap gap-x-2'>
                        <div onClick={() => { productReaction() }} className='flex flex-wrap gap-x-2 w-auto items-center justify-center gap-y-2'>
                            <div onClick={() => { setSelected({ categoryName: "Kategoriler" }) }} className='btn w-auto rounded-md btn-sm sm:btn-sm md:btn-md '>
                                Tüm Ürünler
                            </div>
                        </div>
                        {
                            categories.map((category, key) => {
                                return <div className={`btn w-auto  rounded-md  btn-sm sm:btn-sm md:btn-md ${selected?.categoryId === category.categoryId ? "bg-yellow-800" : null} `} onClick={
                                    () => {
                                        setSelected({ categoryId: category.categoryId });
                                        productByCategoryIdReaction(category.categoryId)
                                    }} key={category.categoryId}><div>{category.name}</div></div>
                            })
                        }

                    </div>}
                </div>
            </div>
            <div className='flex w-full items-center  justify-center '>
                <div className='flex items-center gap-x-4 justify-center flex-wrap gap-y-8'>
                    {products.length === 0 && loadingPage().map(res => {
                        return res.res
                    })}
                    {
                        products.length > 0 && products.map((product, key) => {

                            return <Link to={`product/${product.productId}`} key={product.productId}
                                className="card w-44 md:w-52   hover:scale-110 transition-all shadow-2xl hover:shadow-lg h-auto cursor-pointer group">

                                <figure ><ListenImages target={"productImages"} productId={product.productId}></ListenImages></figure>
                                <div className="card-body">
                                    <div>
                                        <h2 className="card-title truncate min-w-fit  text-md">{product.productName}</h2>
                                        <h4 className='font-serif text-xs   opacity-60'>{product.categoryName}</h4>
                                    </div>
                                    <ProductRating id={product.productId} size={"xs"} initialRating={product.rating} />
                                    <div className='w-full h-auto'><div className=" badge  text-xs rounded-md md:text-md badge-secondary badge-lg badge-outline">{product.basePrice} &#x20BA;</div></div>
                                    <div className="card-actions w-full">
                                        <button className=" opacity-100 w-full bg-brandGreen font-sans font-semibold text-gray-100 shadow-2xl transition-all mt-2 rounded-md py-2 px-2  text-xs md:text-md ">Ürünü İncele</button>
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
