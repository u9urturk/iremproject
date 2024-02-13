import React, { useEffect, useState } from 'react'
import ProductAdd from '../components/ProductAdd'
import { AiOutlineDelete } from 'react-icons/ai'
import { RxUpdate } from 'react-icons/rx'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { getCategoryByCategoryId, getProductByCategoryId } from '../firebase'
import { useParams } from 'react-router-dom'
import baseImage from '../materials/baseImages/420x260.webp'
import ListenImages from '../components/ListenImages'

export default function ProductsByCategory() {
    const user = useSelector(state => state.auth.user)
    const [products, setProducts] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const categoryId = useParams();


    const productReaction = () => {
        setProducts("");
        getProductByCategoryId(categoryId.categoryId).then((res) => {
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
    }, [categoryId])

    const loadingPage = () => {
        const set = []
        let range = 9;
        for (let i = 0; i < range; i++) {
            set.push({
                res: <div class="  shadow rounded-md my-2 p-4 w-  w-56 mx-auto">
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

   
    return (
        <div class="container px-5   mx-auto ">
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
                                   
                                </div>}
                                <figure ><ListenImages  productId={product.productId}></ListenImages></figure>
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
