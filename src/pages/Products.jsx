import React, { useEffect, useState } from 'react'
import { getCategories, getCategoryByCategoryId, getProductByCategoryId, getProducts } from '../firebase'
import ListenImages from '../components/ListenImages'
import { Link } from 'react-router-dom'


export default function Products() {
    const getProductsBase = getProducts();
    const [products, setProducts] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const getCategoriesBase = getCategories();
    const [categories, setCategories] = useState([])

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
                    setCategoryName(res.categoryName);
                });
                let data = {
                    productId: doc.id,
                    categoryName: categoryName,
                    ...doc.data()
                }


                setProducts(prevState => [...prevState, data])
            });

        })




    }

    useEffect(() => {
        categoryReaction()
        productReaction()
    }, [])

    console.log(products)

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
                        <div onClick={() => { productReaction() }}  className='flex flex-col w-auto items-center justify-center gap-y-2'>

                            <div className='btn w-auto  btn-xs sm:btn-sm md:btn-md '>
                                Tüm Ürünler
                            </div>
                        </div>
                        {categories.map((data, key) => {

                            return <div onClick={() => { productByCategoryIdReaction(data.categoryId) }} key={key} className='flex flex-col items-center justify-center gap-y-2'>

                                <div className='btn w-full btn-xs sm:btn-sm md:btn-md '>
                                    {data.categoryName}
                                </div>
                            </div>

                        })}


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

                            return <Link to={"product/test"} key={key} className="card w-60  shadow-xl hover:scale-110 transition-all glass h-auto cursor-pointer group">

                                <figure ><ListenImages productId={product.productId}></ListenImages></figure>
                                <div className="card-body  ">
                                    <h2 className="card-title text-md">{product.productName}</h2>
                                    <h4 className='font-serif  opacity-60'>{product.categoryName}</h4>
                                    <div className="card-actions relative pt-1 md:pt-4 flex md:flex-col items-center  justify-center">

                                        <div className='w-full h-auto'><div className=" badge  text-xs  md:text-md badge-secondary badge-lg badge-outline">{product.price} &#x20BA;</div></div>
                                        <button className=" opacity-100 bg-brandGreen font-sans font-semibold text-gray-100 shadow-2xl transition-all mt-2 md:hover:bg-base-300 rounded-3xl py-2 px-2  w-full  text-xs md:text-md ">Ürünü İncele</button>
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
