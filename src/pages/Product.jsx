import React, { useCallback, useEffect, useState } from 'react'
import Carousel from '../components/Carousel'
import { useParams } from 'react-router-dom';
import { getColorByColorId, getFabricsByFabricId, getPatternByPatternId, getProductByProductId } from '../firebase';
import ProductRating from '../components/ProductRaiting';
import { IoColorPaletteOutline } from "react-icons/io5";
import { GiRolledCloth } from "react-icons/gi";
import { MdOutlinePattern } from "react-icons/md";
import CustomerReviews from '../components/CustomerReviews';




export default function Product() {

  const { productId } = useParams();
  const [product, setProduct] = useState(null)

  const getProductReaction = useCallback(
    () => {
      getProductByProductId(productId).then(async res => {
        const colorPromise = getColorByColorId(res.colorId);
        const fabricPromise = getFabricsByFabricId(res.fabricId);
        const patternPromise = getPatternByPatternId(res.patternId);

        const [color, fabric, pattern] = await Promise.all([colorPromise, fabricPromise, patternPromise]);

        setProduct({
          name: res.productName,
          price: res.price,
          color: color.name,
          fabric: fabric.name,
          pattern: pattern.name,
          rating: Math.round(res.rating),
          explanation:res.explanation
        });
      })
    },
    [productId],
  )


  useEffect(() => {
    getProductReaction();
  }, [getProductReaction])

  if (product) {
    return (
      <div className='container md:px-8 md:mx-auto  text-4xl text-red-900'>
        <section class="py-12 ">
          <div className="card flex flex-col md:flex-row items-center justify-center lg:card-side bg-base-100 ">
            <figure className='w-full  md:w-1/4'>
              <Carousel productId={productId}></Carousel>
            </figure>
            <div className="card-body w-full flex items-center justify-center gap-y-8 md:gap-y-0 md:w-3/4">
              <div className='flex w-full flex-col md:flex-row items-center md:pb-4  md:px-2 md:justify-between'>
                <h2 className="card-title  text-4xl">{product.name}</h2>
                <div>
                  <ProductRating id={productId} initialRating={product.rating} size={'md'}></ProductRating>
                </div>
              </div>
              <p className='text-base pl-8 opacity-95 '>{product.explanation}</p>
              <div className="card-actions pt-8 pl-8 flex items-center w-full justify-center md:justify-between gap-y-8">
                <div className='text-base flex p-4 lg:border-l-0 border-l-2 rounded-tl-3xl border-l-base-300 rounded-tr-3xl border-t-2 border-t-base-300 border-r-base-300 border-r-2 items-center justify-center flex-col gap-y-4 font-semibold'>
                  <strong>Özellikler</strong>
                  <div className='flex items-center justify-between flex-row gap-x-8 font-semibold'>
                    <div  data-tip="Renk" className='flex items-center tooltip justify-center flex-col'>
                      <IoColorPaletteOutline size={30} />
                      <div>{product.color}</div>
                    </div>
                    <div  data-tip="Kumaş" className='flex items-center tooltip justify-center flex-col'>
                      <GiRolledCloth  size={30} />
                      <div>{product.fabric}</div>
                    </div>
                    <div  data-tip="Desen" className='flex items-center tooltip justify-center flex-col'>
                      <MdOutlinePattern  size={30} />
                      <div>{product.pattern}</div>
                    </div>
                  </div>
                </div>
                <div className='flex w-full justify-between items-center ' >
                  <div className='flex items-center justify-center text-3xl font-semibold'>{product.price} ₺ </div>
                  <button className="btn rounded-md btn-primary">Sepete Ekle</button>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section class="py-8 h-full w-full px-8 shadow-inner shadow-base-300 rounded-2xl">
          <div class="md:container h-full w-full md:mx-auto">
            <CustomerReviews getProductId={productId}></CustomerReviews>
          </div>
        </section>
      </div>
    )
  } else {
    return (
      <div className='container flex items-center justify-center h-screen px-8 mx-auto text-4xl text-red-900'>
        <h1>YÜKLENİYOR...</h1>
      </div>
    )
  }
}
