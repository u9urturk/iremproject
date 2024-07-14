import React, { useEffect, useState } from 'react'
import { getCategories, getCategoryByCategoryId, getProductByCategoryId, getProducts } from '../firebase'
import ListenImages from '../components/ListenImages'
import { Link } from 'react-router-dom'

export default function Products() {
    const dropdownMenu = document.querySelector('.dropdown-content');
    const overlay = document.querySelector('#overlay');

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

    console.log(categories)

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

    console.log(selected)



    return (
        <div class="flex flex-col items-center justify-center gap-y-16   ">
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>
                <div className='flex flex-col z-[1]  gap-y-2 items-center justify-center'>
                    {categories.length == 0 && <div className='py-1 px-2'>Yükleniyor ...</div>}


                    {categories.length > 0 && <div className='flex items-center gap-y-2 justify-center flex-wrap gap-x-2'>
                        <div onClick={() => { productReaction() }} className='flex flex-col w-auto items-center justify-center gap-y-2'>

                            <div onClick={() => { setSelected({ categoryName: "Kategoriler" }) }} className='btn w-auto  btn-sm sm:btn-sm md:btn-md '>
                                Tüm Ürünler
                            </div>

                        </div>

                        {/* <!-- Overlay --> */}
                        <div id="overlay" class="fixed  inset-0 bg-black bg-opacity-50 hidden"></div>
                        <div className="dropdown  z-[2]  btn w-auto  btn-sm sm:btn-sm md:btn-md">
                            <div onClick={()=>{ overlay.classList.remove('hidden'); dropdownMenu.classList.remove('hidden')}} tabIndex={0} role="button" className=" flex items-center justify-center btn-sm sm:btn-sm md:btn-md">{selected.categoryName}</div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
                                {

                                    categories.map((category, key) => {
                                        return <li onClick={
                                            () => {
                                                setSelected({ categoryName: category.categoryName });
                                                productByCategoryIdReaction(category.categoryId)
                                                dropdownMenu.classList.add('hidden')
                                                overlay.classList.add('hidden')
                                            }} key={key}><a>{category.categoryName}</a></li>
                                    })
                                }

                            </ul>
                        </div>

                        <div onClick={() => { setSelected({ categoryName: "Kategoriler" }) }} className='btn w-auto  btn-sm sm:btn-sm md:btn-md '>
                            Renkler
                        </div>

                        <div onClick={() => { setSelected({ categoryName: "Kategoriler" }) }} className='btn w-auto  btn-sm sm:btn-sm md:btn-md '>
                            Desenler
                        </div>





                    </div>}
                </div>
            </div>
            <div className='flex w-full items-center  justify-center '>
                <div className='flex items-center gap-x-8 justify-center flex-wrap gap-y-8'>
                    {products.length == 0 && loadingPage().map(res => {
                        return res.res
                    })}
                    {
                        products.length > 0 && products.map((product, key) => {

                            return <Link to={`product/${product.productId}`} key={key} className="card w-36 md:w-52   hover:scale-110 transition-all shadow-2xl hover:shadow-lg h-auto cursor-pointer group">

                                <figure ><ListenImages productId={product.productId}></ListenImages></figure>
                                <div className="card-body flex items-start justify-start ">
                                    <h2 className="card-title truncate min-w-fit  text-sm">{product.productName}</h2>
                                    <h4 className='font-serif text-xs   opacity-60'>{product.categoryName}</h4>
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
