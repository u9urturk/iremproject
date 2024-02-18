import React, { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'
import { getCategoryByCategoryId, getProductByProductId } from '../firebase'

export default function Product() {
    const productId = useParams();
    const [product, setProduct] = useState();
  

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

    useEffect(() => {
        productReaction();

    }, [productId])


    console.log(product)



    return (
       !product ? <div className='bg-transparent w-full h-screen'></div> : <div className='pt-10 w-full animate-fade-left animate-ease-in-out animate-normal animate-fill-forwards  h-auto flex items-center justify-center' >
            <div className=' flex flex-row items-start justify-between max-w-[calc(90%)] h-screen rounded-[3rem] w-full bg-gray-100'>
                <div className='relative w-1/4'>
                    <div className='absolute -left-8 -top-8 bg-brandGreen max-w-xs w-auto h-screen rounded-[3rem]'>
                        <div className='px-8 py-4 text-lg text-white font-semibold flex items-center justify-center gap-x-2'>
                            {product.productName}
                        </div>
                        <ul className="menu bg-transparent flex items-start justify-center text-white w-56 rounded-box">
                            <li><Link to={"kategoriislemleri"}>Kategori İşlemleri</Link></li>
                            <li><Link to={"ozellikislemleri"} >Özellik İşlemleri</Link></li>
                            <li><Link to={"urunislemleri"} >Ürün İşlemleri</Link></li>
                            <li><Link to={"kullaniciislemleri"} >Kullanıcı İşlemleri</Link></li>
                        </ul>

                    </div>
                </div>
                <div className='h-full py-8 pr-8 flex items-center justify-center w-3/4'>
                    <div className='flex w-full h-full flex-col items-center justify-center'>


                    </div>
                </div>
            </div>

        </div>
    )
}
