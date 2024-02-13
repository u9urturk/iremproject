import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCategories, getCategoryByCategoryId, getProductByCategoryId, getProducts } from '../firebase'
import ListenImages from '../components/ListenImages'
import Categories from '../components/Categories'
import { Link } from 'react-router-dom'


export default function Products() {
    const user = useSelector(state => state.auth.user)
    const getProductsBase = getProducts();
    const [products, setProducts] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const [currentProduct, setCurrentProduct] = useState(null)
    const [file, setFile] = useState(null)

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
                    setCategoryName(res.categoryName);
                });
                let data = {
                    productId: doc.id,
                    categoryName: categoryName,
                    ...doc.data()
                }


                setProducts(prevState => [...prevState, data])
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
        productReaction()
        categoryReaction()
    }, [])


    const loadingPage = () => {
        const set = []
        let range = 9;
        for (let i = 0; i < range; i++) {
            set.push({
                res: <div class="  shadow rounded-md my-2 p-4 w-36 md:w-56 mx-auto">
                  
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


                    {categories.length > 0 && <div className='flex items-center justify-center gap-x-2 text-brandWhite'>
                        {categories.map((data, key) => {

                            return <div onClick={() => { productByCategoryIdReaction(data.categoryId) }} key={key} className='flex flex-col items-center justify-center gap-y-2'>

                                <div className='btn glass btn-xs sm:btn-sm md:btn-md '>
                                    {data.categoryName}
                                </div>
                            </div>

                        })}


                    </div>}
                </div>
            </div>
            <div className='flex items-center justify-center '>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:gird-cols-5  gap-y-16 md:gap-x-12 md:gap-y-24'>
                    {products.length == 0 && loadingPage().map(res => {
                        return res.res
                    })}
                    {
                        products.length > 0 && products.map((product, key) => {

                            return <Link to={"product/test"} key={key} className="card w-60 shadow-xl glass h-auto cursor-pointer group">

                                <figure ><ListenImages productId={product.productId}></ListenImages></figure>
                                <div className="card-body  ">
                                    <h2 className="card-title text-md">{product.productName}</h2>
                                    <div className="card-actions relative pt-1 md:pt-4 flex md:flex-col items-center  justify-center">

                                        <div className='w-full h-auto'><div className=" badge  text-xs  md:text-md badge-secondary badge-lg badge-outline">{product.price} &#x20BA;</div></div>
                                        <button className=" md:opacity-0 md:group-hover:opacity-100 bg-base-200 transition-all mt-2 md:hover:bg-base-300 rounded-3xl py-2 px-2  w-full  text-xs md:text-md ">Sepete Ekle</button>
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
