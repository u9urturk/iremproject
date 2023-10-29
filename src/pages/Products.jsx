import React, { useEffect, useState } from 'react'
import ProductAdd from '../components/ProductAdd'
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { downloadImage, getCategoryByCategoryId, getProducts, uploadImage } from '../firebase'
import ListenImages from '../components/ListenImages'


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
                res: <div class="  shadow rounded-md my-2 p-4 max-w-sm w-full mx-auto">
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
        <div class="container px-5 py-24 mx-auto ">
            <div className='pb-8'><ProductAdd></ProductAdd></div>
            <div class="flex flex-wrap -m-4 ">
                {products.length == 0 && loadingPage().map(res => {
                    return res.res
                })}
                {
                    products.length > 0 && products.map((product, key) => {
                        
                        return <div key={key} class="relative group/card lg:w-1/4 md:w-1/2 p-4 w-full  cursor-pointer hover:scale-105 transition-all">
                            {user && <div className='hidden  group-hover/card:block   '>
                                <div className='absolute left-6 top-5 z-[1] gap-x-2 flex items-center justify-center py-2'>
                                    <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Sil'><AiOutlineDelete size={18} color='red'  ></AiOutlineDelete></div>
                                    <div className='cursor-pointer hover:scale-125 active:scale-100 transition-all' title='Güncelle'><RxUpdate size={18} color='green' ></RxUpdate></div>


                                </div>
                                <div className='absolute right-6 top-5 z-[1] gap-x-2 flex items-center justify-center py-2'>
                                    <input accept='image/jpeg' onClick={() => { setCurrentProduct(product.productId) }} type='file' multiple onChange={((e) => { setFile(e.target.files) })} className='cursor-pointer hover:scale-125 active:scale-100 transition-all ' title='Görsel Güncelle'></input>
                                </div>
                            </div>}
                            <a class="block relative h-48 rounded overflow-hidden">
                                <ListenImages productId={product.productId}></ListenImages>
                            </a>
                            <div class="mt-4">
                                <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">{product.categoryName}</h3>
                                <h2 class="text-gray-900 title-font text-lg font-medium">{product.productName}</h2>
                                <p class="mt-1">{product.price} &#x20BA;  </p>

                            </div>
                        </div>
                        
                    })
                } 
            </div>
        </div>
    )
}
