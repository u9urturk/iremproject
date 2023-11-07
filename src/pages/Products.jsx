import React, { useEffect, useState } from 'react'
import ProductAdd from '../components/ProductAdd'
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { downloadImage, getCategoryByCategoryId, getProducts, uploadImage } from '../firebase'
import ListenImages from '../components/ListenImages'
import Categories from '../components/Categories'
import Billboard from '../components/Billboard'


export default function Products() {
    const user = useSelector(state => state.auth.user)
    const getProductsBase = getProducts();
    const [products, setProducts] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const [currentProduct, setCurrentProduct] = useState(null)
    const [file, setFile] = useState(null)


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

    useEffect(() => {
        productReaction()
    }, [])


    const loadingPage = () => {
        const set = []
        let range = 9;
        for (let i = 0; i < range; i++) {
            set.push({
                res: <div class="  shadow rounded-md my-2 p-4 w-36 md:w-56 mx-auto">
                    <div class="animate-pulse flex space-x-4">
                        <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                        <div class="flex-1 space-y-6 py-1">
                            <div class="h-2 bg-slate-700 rounded"></div>
                            <div class="space-y-3">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                                    <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                                </div>
                                <div class="h-2 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            })

        }
        return set;
    }


    const updateImage = () => {
        if (currentProduct != null && file != null) {
            uploadImage(currentProduct, file[0]);
            setCurrentProduct(null);
            setFile(null);
        }
    }


    useEffect(() => {
        updateImage()
    }, [file])


    return (
        <div class="container px-5   mx-auto ">
            <Billboard></Billboard>
            <div className='w-full  h-auto text-sm md:text-base flex items-center justify-center gap-x-1 md:gap-x-6 py-2'>
                <Categories></Categories>
            </div>
            <div className='pb-8'><ProductAdd></ProductAdd></div>
            <div className='flex items-center justify-center '>
                <div className='grid grid-cols-2 md:grid-cols-5  gap-6 md:gap-8'>
                    {products.length == 0 && loadingPage().map(res => {
                        return res.res
                    })}
                    {
                        products.length > 0 && products.map((product, key) => {

                            return <div key={key} className="card w-36  md:w-56 shadow-xl glass h-auto cursor-pointer group">
                                {user && <div className='hidden  group-hover:block transition-all  '>
                                    <div className='absolute left-6 top-5 z-[1] gap-x-2 flex items-center justify-center py-2'>
                                        <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'><AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>
                                        <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Güncelle'><RxUpdate size={18} color='green' ></RxUpdate></div>
                                    </div>
                                    <div className='absolute right-6 top-5 z-[1] gap-x-2 flex items-center justify-center py-2'>
                                        <input accept='image/jpeg' onClick={() => { setCurrentProduct(product.productId) }} type='file' multiple onChange={((e) => { setFile(e.target.files) })} className='cursor-pointer hover:scale-125 active:scale-100 transition-all ' title='Görsel Güncelle'></input>
                                    </div>
                                </div>}
                                <figure ><ListenImages productId={product.productId}></ListenImages></figure>
                                <div className="card-body  ">
                                    <h2 className="card-title text-xs md:text-md">{product.productName}</h2>
                                    <div className="card-actions relative pt-1 md:pt-4 flex md:flex-col items-center  justify-center">

                                        <div className='w-full h-auto'><div className=" badge  text-xs  md:text-md badge-secondary badge-lg badge-outline">{product.price} &#x20BA;</div></div>
                                        <button className=" md:opacity-0 md:group-hover:opacity-100 bg-base-200 transition-all mt-2 md:hover:bg-base-300 rounded-3xl py-2 px-2  w-full  text-xs md:text-md ">Sepete Ekle</button>
                                    </div>


                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
